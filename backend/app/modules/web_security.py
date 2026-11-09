import urllib.error
import urllib.request
from urllib.parse import urlparse

from app.modules.safe_target import PublicOnlyRedirectHandler, points_to_private_address

REQUEST_TIMEOUT_SECONDS = 4
USER_AGENT = "ThreatWhoScanner/1.0 (passive header check)"
HEADER_PENALTIES = {
    "Strict-Transport-Security": 20,
    "Content-Security-Policy": 25,
    "X-Frame-Options": 15,
    "X-Content-Type-Options": 10,
    "Referrer-Policy": 5,
}


# Adds https:// when missing so the URL can be fetched.
def add_scheme_if_missing(url):
    return url if "://" in url else "https://" + url


# Reads only the response headers, like any browser would, and blocks private redirects.
def fetch_response_headers(url):
    opener = urllib.request.build_opener(PublicOnlyRedirectHandler)
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with opener.open(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            return response.headers, response.geturl()
    except urllib.error.HTTPError as error:
        return error.headers, url


# A CSP frame-ancestors rule protects against clickjacking just like X-Frame-Options.
def has_clickjacking_protection(headers):
    contentPolicy = headers.get("Content-Security-Policy", "").lower()
    return "X-Frame-Options" in headers or "frame-ancestors" in contentPolicy


# Lists the protective headers the site forgot to send.
def find_missing_headers(headers, isHttps):
    missingHeaders = []
    for headerName in HEADER_PENALTIES:
        if headerName == "Strict-Transport-Security" and not isHttps:
            continue
        if headerName == "X-Frame-Options" and has_clickjacking_protection(headers):
            continue
        if headerName not in headers:
            missingHeaders.append(headerName)
    return missingHeaders


# Plain HTTP means everything the visitor types can be read on the network.
def check_https(isHttps):
    if isHttps:
        return []
    return [(30, "Site does not use HTTPS, so traffic is not encrypted.")]


# Cookies without Secure or HttpOnly are easier to steal.
def check_cookies(headers):
    for cookie in headers.get_all("Set-Cookie") or []:
        lowered = cookie.lower()
        if "secure" not in lowered or "httponly" not in lowered:
            return [(10, "Cookies are missing the Secure or HttpOnly flag.")]
    return []


# A Server header with a version number helps attackers pick known exploits.
def check_server_leak(headers):
    serverName = headers.get("Server", "")
    if any(character.isdigit() for character in serverName):
        return [(5, f"Server header reveals software version ({serverName}).")]
    return []


# Runs every check and returns the (penalty, message) pairs.
def collect_findings(headers, isHttps, missingHeaders):
    findings = [(HEADER_PENALTIES[name], f"Missing {name} header") for name in missingHeaders]
    findings += check_https(isHttps)
    findings += check_cookies(headers)
    findings += check_server_leak(headers)
    return findings


# Fetches the site and builds the module-contract dictionary.
def build_report(url):
    fullUrl = add_scheme_if_missing(url.strip())
    if points_to_private_address(urlparse(fullUrl).hostname):
        raise ValueError("target is not a public address")
    headers, finalUrl = fetch_response_headers(fullUrl)
    isHttps = urlparse(finalUrl).scheme == "https"
    missingHeaders = find_missing_headers(headers, isHttps)
    findings = collect_findings(headers, isHttps, missingHeaders)
    totalPenalty = sum(points for points, message in findings)
    return {
        "module": "web_security",
        "score": max(0, 100 - totalPenalty),
        "issues": [message for points, message in findings],
        "details": {"headers_missing": missingHeaders, "final_url": finalUrl},
    }


# Public entry point: never raises, so one failed fetch cannot break the scan.
def analyze_web_security(url):
    try:
        return build_report(url)
    except Exception as error:
        return {
            "module": "web_security",
            "score": None,
            "issues": [],
            "details": {},
            "error": f"Web security check skipped: {error}",
        }