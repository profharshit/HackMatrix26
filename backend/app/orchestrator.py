from concurrent.futures import ThreadPoolExecutor, wait
from datetime import datetime, timezone
from urllib.parse import urlparse
import uuid
import ipaddress

from app.aggregator import build_reasons, calculate_trust_score, pick_verdict
from app.config import MODULE_TIMEOUT_SECONDS
from app.modules.certificate import analyze_certificate
from app.modules.model_predictor import predict_with_model
from app.modules.threat_intel import get_threat_intel
from app.modules.web_security import analyze_web_security


# Three of the modules only need the hostname, not the full URL
def extract_domain(url):
    if "://" not in url:
        url = "https://" + url
    return urlparse(url).hostname or ""


# Same failure shape as the module contract, so the merge code never special-cases errors
def build_failed_result(moduleName, errorMessage):
    return {"error": f"{moduleName}: {errorMessage}", "score": None}


# Turns one finished (or unfinished) module call into a plain dict
def read_module_result(moduleName, future):
    if not future.done():
        return build_failed_result(moduleName, "timed out")
    try:
        return future.result()
    except Exception as error:
        return build_failed_result(moduleName, str(error))

# Plain HTTP sites have no certificate, so we skip instead of waiting for a timeout
def check_certificate_if_possible(url, domain):
    if url.lower().startswith("http://"):
        return {
            "module": "certificate",
            "score": None,
            "issues": [],
            "details": {"note": "Site uses plain HTTP, so there is no certificate to check"},
        }
    return analyze_certificate(domain)

# Starts all four checks at once so total scan time is the slowest one, not the sum
def run_modules_in_parallel(url, domain):
    pool = ThreadPoolExecutor(max_workers=4)
    futures = {
        "model": pool.submit(predict_with_model, url),
                "certificate": pool.submit(check_certificate_if_possible, url, domain),
        "web_security": pool.submit(analyze_web_security, url),
        "threat_intel": pool.submit(get_threat_intel, domain),
    }
    wait(futures.values(), timeout=MODULE_TIMEOUT_SECONDS)
    pool.shutdown(wait=False)
    return {name: read_module_result(name, future) for name, future in futures.items()}

MAX_SCORE_FOR_IP_HOST = 60


# Tells whether the host is a raw IP address instead of a real domain name
def is_ip_address(host):
    try:
        ipaddress.ip_address(host)
        return True
    except ValueError:
        return False


# A raw IP served over plain HTTP is a common malware-hosting pattern, so it can never be called safe
def cap_score_for_risky_host(url, domain, trustScore):
    isPlainHttp = url.lower().startswith("http://")
    if is_ip_address(domain) and isPlainHttp:
        return min(trustScore, MAX_SCORE_FOR_IP_HOST)
    return trustScore

# Single entry point the router calls: scan, then package the merged result
def scan_url(url):
    domain = extract_domain(url)
    breakdown = run_modules_in_parallel(url, domain)
    trustScore = cap_score_for_risky_host(url, domain, calculate_trust_score(breakdown))
    return {
        "id": uuid.uuid4().hex[:8],
        "url": url,
        "trust_score": trustScore,
        "verdict": pick_verdict(trustScore),
        "breakdown": breakdown,
        "reasons": build_reasons(breakdown, trustScore),
        "scanned_at": datetime.now(timezone.utc).isoformat(),
    }
