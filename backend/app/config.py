from pathlib import Path

# A "safe" verdict needs at least this many checks to have finished
MIN_WORKING_MODULES_FOR_SAFE = 3

# Every module gets the same time limit so one slow check cannot freeze the scan
MODULE_TIMEOUT_SECONDS = 5

# How much each module counts toward the final score (tune here, must add up to 1.0)
# Every module score means: 100 = looks safe, 0 = looks dangerous
SCORE_WEIGHTS = {
    "model": 0.40,
    "certificate": 0.20,
    "web_security": 0.15,
    "threat_intel": 0.25,
}

# Final score at or above this is "safe"
SAFE_MIN_SCORE = 70

# Final score at or above this (but below safe) is "suspicious", anything lower is "dangerous"
SUSPICIOUS_MIN_SCORE = 40

# Used when every module fails, so a broken scan never claims "dangerous" or "safe"
SCORE_WHEN_ALL_CHECKS_FAIL = 50

# Where the ML teammate's file must be placed (fixed on purpose, never taken from user input)
MODEL_FILE_PATH = Path(__file__).parent / "models" / "phishing_url_only_pipeline.joblib"

# Feature names in the exact order the model was trained with (replace with teammate's list)
# Each name must exist in extract_url_features() inside modules/url_features.py
MODEL_FEATURE_NAMES = [
    "url_length",
    "dot_count",
    "hyphen_count",
    "digit_count",
    "has_at_symbol",
    "uses_https",
    "has_ip_address",
    "subdomain_count",
    "has_suspicious_word",
]
