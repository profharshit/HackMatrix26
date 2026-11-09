import ipaddress
import re
from urllib.parse import urlsplit

URL_ONLY_FEATURES = [
    "URLLength", "DomainLength", "IsDomainIP", "TLDLength", "NoOfSubDomain",
    "HasObfuscation", "NoOfObfuscatedChar", "ObfuscationRatio",
    "NoOfLettersInURL", "LetterRatioInURL", "NoOfDegitsInURL", "DegitRatioInURL",
    "NoOfEqualsInURL", "NoOfQMarkInURL", "NoOfAmpersandInURL",
    "NoOfOtherSpecialCharsInURL", "SpacialCharRatioInURL", "IsHTTPS",
]
OTHER_SPECIAL_CHARACTERS = "-_~!$'()*+,;:/[]{}\\|^`<>"


# Adds http:// when missing so the URL parser can find the hostname.
def addSchemeIfMissing(rawUrl):
    if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", rawUrl):
        return rawUrl
    return "http://" + rawUrl


# Tells whether the host is a raw IP address, a common phishing sign.
def isIpAddress(host):
    try:
        ipaddress.ip_address(host)
        return 1
    except ValueError:
        return 0


# Counts how many characters of the URL appear in the given set.
def countCharactersIn(text, characterSet):
    return sum(character in characterSet for character in text)


# Calculates the character counts that several features share.
def countUrlCharacters(rawUrl):
    return {
        "letters": sum(character.isalpha() for character in rawUrl),
        "digits": sum(character.isdigit() for character in rawUrl),
        "special": sum(not character.isalnum() for character in rawUrl),
        "obfuscated": countCharactersIn(rawUrl, "%@"),
        "otherSpecial": countCharactersIn(rawUrl, OTHER_SPECIAL_CHARACTERS),
    }


# Builds every feature value, using the same formulas as the training notebook.
def buildFeatureValues(rawUrl, parsedUrl, host):
    labels = [part for part in host.split(".") if part]
    counts = countUrlCharacters(rawUrl)
    urlLength = max(len(rawUrl), 1)
    return {
        "URLLength": len(rawUrl),
        "DomainLength": len(host),
        "IsDomainIP": isIpAddress(host),
        "TLDLength": len(labels[-1]) if len(labels) > 1 else 0,
        "NoOfSubDomain": max(len(labels) - 2, 0),
        "HasObfuscation": int(counts["obfuscated"] > 0 or "xn--" in host),
        "NoOfObfuscatedChar": counts["obfuscated"],
        "ObfuscationRatio": counts["obfuscated"] / urlLength,
        "NoOfLettersInURL": counts["letters"],
        "LetterRatioInURL": counts["letters"] / urlLength,
        "NoOfDegitsInURL": counts["digits"],
        "DegitRatioInURL": counts["digits"] / urlLength,
        "NoOfEqualsInURL": rawUrl.count("="),
        "NoOfQMarkInURL": rawUrl.count("?"),
        "NoOfAmpersandInURL": rawUrl.count("&"),
        "NoOfOtherSpecialCharsInURL": counts["otherSpecial"],
        "SpacialCharRatioInURL": counts["special"] / urlLength,
        "IsHTTPS": int(parsedUrl.scheme.lower() == "https"),
    }


# Public entry point: turns one URL string into a dict of model features.
def extract_url_features(url):
    rawUrl = url.strip()
    parsedUrl = urlsplit(addSchemeIfMissing(rawUrl))
    host = (parsedUrl.hostname or "").lower()
    if not host:
        raise ValueError("Could not find a hostname in the URL")
    return buildFeatureValues(rawUrl, parsedUrl, host)