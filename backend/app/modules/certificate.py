import json
import socket
import ssl
from datetime import datetime, timezone
from pathlib import Path

from cryptography import x509
from cryptography.hazmat.primitives.asymmetric import ec, rsa
from cryptography.x509.oid import NameOID

CONNECT_TIMEOUT_SECONDS = 2.5
MINIMUM_RSA_KEY_BITS = 2048
MAXIMUM_VALIDITY_DAYS = 398
EXPIRING_SOON_DAYS = 14
WEAK_SIGNATURE_HASHES = ("sha1", "md5")
WATCHLIST_PATH = Path(__file__).resolve().parent.parent / "data" / "distrusted_cas.json"


# Gets the raw certificate bytes from the server, with or without trust checking.
def fetch_certificate_bytes(domain, shouldVerify):
    context = ssl.create_default_context()
    if not shouldVerify:
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
    with socket.create_connection((domain, 443), timeout=CONNECT_TIMEOUT_SECONDS) as plainSocket:
        with context.wrap_socket(plainSocket, server_hostname=domain) as secureSocket:
            return secureSocket.getpeercert(binary_form=True)


# Loads the certificate and keeps the trust error (if any) so bad certificates can still be inspected.
def load_certificate(domain):
    try:
        rawBytes = fetch_certificate_bytes(domain, shouldVerify=True)
        return x509.load_der_x509_certificate(rawBytes), None
    except ssl.SSLCertVerificationError as error:
        trustProblem = error.verify_message
    rawBytes = fetch_certificate_bytes(domain, shouldVerify=False)
    return x509.load_der_x509_certificate(rawBytes), trustProblem


# Reads the CA watchlist the user can edit, and never fails if the file is missing or broken.
def load_ca_watchlist():
    try:
        with open(WATCHLIST_PATH, encoding="utf-8") as watchlistFile:
            return json.load(watchlistFile).get("distrusted_or_under_review", [])
    except (OSError, ValueError):
        return []


# Returns the certificate's alternative names, which are the hostnames it is valid for.
def get_san_names(certificate):
    try:
        extension = certificate.extensions.get_extension_for_class(x509.SubjectAlternativeName)
    except x509.ExtensionNotFound:
        return []
    return extension.value.get_values_for_type(x509.DNSName)


# Compares one certificate name (maybe a wildcard like *.site.com) with the scanned domain.
def name_matches_domain(certificateName, domain):
    certificateName = certificateName.lower()
    domain = domain.lower()
    if certificateName.startswith("*."):
        return domain.split(".", 1)[-1] == certificateName[2:]
    return certificateName == domain


# Finds the issuing company name, falling back to the common name.
def get_issuer_name(certificate):
    for nameType in (NameOID.ORGANIZATION_NAME, NameOID.COMMON_NAME):
        attributes = certificate.issuer.get_attributes_for_oid(nameType)
        if attributes:
            return attributes[0].value
    return "Unknown issuer"


# Describes the public key in plain words, such as "RSA 2048".
def describe_key(certificate):
    publicKey = certificate.public_key()
    if isinstance(publicKey, rsa.RSAPublicKey):
        return f"RSA {publicKey.key_size}"
    if isinstance(publicKey, ec.EllipticCurvePublicKey):
        return f"EC {publicKey.curve.name}"
    return type(publicKey).__name__


# Counts the days left before expiry (negative means already expired).
def days_until_expiry(certificate):
    return (certificate.not_valid_after_utc - datetime.now(timezone.utc)).days


# Skips trust errors that other checks already report, so the score is not penalized twice.
def is_reported_elsewhere(trustProblem):
    lowered = trustProblem.lower()
    return "expired" in lowered or "mismatch" in lowered or "self-signed" in lowered


# Flags a broken certificate chain.
def check_chain(trustProblem):
    if trustProblem and not is_reported_elsewhere(trustProblem):
        return [(40, f"Certificate chain is not trusted: {trustProblem}.")]
    return []


# Flags expired certificates and ones that expire soon.
def check_expiry(certificate):
    daysLeft = days_until_expiry(certificate)
    if daysLeft < 0:
        return [(50, f"Certificate expired {-daysLeft} days ago.")]
    if daysLeft <= EXPIRING_SOON_DAYS:
        return [(15, f"Certificate expires in {daysLeft} days.")]
    return []


# Flags certificates that vouch for themselves instead of a real authority.
def check_self_signed(certificate):
    if certificate.issuer == certificate.subject:
        return [(40, "Certificate is self-signed, so no trusted authority vouches for it.")]
    return []


# Flags certificates that do not cover the domain being scanned.
def check_hostname(certificate, domain):
    sanNames = get_san_names(certificate)
    if any(name_matches_domain(name, domain) for name in sanNames):
        return []
    return [(40, f"Certificate is not valid for {domain} (hostname mismatch).")]


# Flags weak RSA keys.
def check_key_size(certificate):
    publicKey = certificate.public_key()
    if isinstance(publicKey, rsa.RSAPublicKey) and publicKey.key_size < MINIMUM_RSA_KEY_BITS:
        return [(25, f"RSA key is only {publicKey.key_size} bits (minimum is {MINIMUM_RSA_KEY_BITS}).")]
    return []


# Flags outdated signature algorithms like SHA-1 and MD5.
def check_signature(signatureName):
    if signatureName in WEAK_SIGNATURE_HASHES:
        return [(25, f"Certificate is signed with weak algorithm {signatureName.upper()}.")]
    return []


# Flags certificates with an unusually long life, which are riskier if stolen.
def check_validity_length(certificate):
    validityDays = (certificate.not_valid_after_utc - certificate.not_valid_before_utc).days
    if validityDays > MAXIMUM_VALIDITY_DAYS:
        return [(10, f"Certificate is valid for {validityDays} days (browsers allow about {MAXIMUM_VALIDITY_DAYS}).")]
    return []


# Flags issuers that appear on the editable distrusted or under-review list.
def check_watchlist(issuerName):
    for watchedAuthority in load_ca_watchlist():
        if watchedAuthority["name"].lower() in issuerName.lower():
            return [(30, f"Issuer {issuerName} is on the watchlist: {watchedAuthority['reason']}")]
    return []


# Runs every check and collects their (penalty, message) pairs.
def run_all_checks(certificate, trustProblem, domain, signatureName, issuerName):
    findings = []
    findings += check_chain(trustProblem)
    findings += check_expiry(certificate)
    findings += check_self_signed(certificate)
    findings += check_hostname(certificate, domain)
    findings += check_key_size(certificate)
    findings += check_signature(signatureName)
    findings += check_validity_length(certificate)
    findings += check_watchlist(issuerName)
    return findings


# Builds the final result dict from the certificate and its findings.
def build_report(domain):
    certificate, trustProblem = load_certificate(domain)
    hashAlgorithm = certificate.signature_hash_algorithm
    signatureName = hashAlgorithm.name if hashAlgorithm else "none"
    issuerName = get_issuer_name(certificate)
    findings = run_all_checks(certificate, trustProblem, domain, signatureName, issuerName)
    totalPenalty = sum(points for points, message in findings)
    return {
        "module": "certificate",
        "score": max(0, 100 - totalPenalty),
        "issues": [message for points, message in findings],
        "details": {
            "issuer": issuerName,
            "days_left": days_until_expiry(certificate),
            "key": describe_key(certificate),
            "signature_algorithm": signatureName,
            "is_self_signed": certificate.issuer == certificate.subject,
            "names": get_san_names(certificate)[:10],
        },
    }


# Public entry point: always returns a dict, even when the server is down or slow.
def analyze_certificate(domain):
    try:
        return build_report(domain)
    except Exception as error:
        return {
            "module": "certificate",
            "score": None,
            "issues": [],
            "details": {},
            "error": f"Certificate check skipped: {error}",
        }
