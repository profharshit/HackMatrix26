from urllib.parse import urlparse
import ipaddress

SUSPICIOUS_WORDS = ["login", "verify", "secure", "account", "update", "bank", "password", "confirm"]


# Phishers often use a raw IP instead of a domain name to hide who owns the site
def is_ip_address(hostname):
    try:
        ipaddress.ip_address(hostname)
        return True
    except ValueError:
        return False


# Common phishing bait words in the URL are a cheap but useful warning sign
def contains_suspicious_word(url):
    lowerUrl = url.lower()
    return any(word in lowerUrl for word in SUSPICIOUS_WORDS)


# Turns a URL into plain numbers that both the model and the backup rules can use
def extract_url_features(url):
    fullUrl = url if "://" in url else "https://" + url
    parsed = urlparse(fullUrl)
    hostname = parsed.hostname or ""
    return {
        "url_length": len(url),
        "dot_count": hostname.count("."),
        "hyphen_count": hostname.count("-"),
        "digit_count": sum(character.isdigit() for character in url),
        "has_at_symbol": int("@" in url),
        "uses_https": int(parsed.scheme == "https"),
        "has_ip_address": int(is_ip_address(hostname)),
        "subdomain_count": max(hostname.count(".") - 1, 0),
        "has_suspicious_word": int(contains_suspicious_word(url)),
    }
