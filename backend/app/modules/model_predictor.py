import logging
import warnings

import joblib
import pandas as pd
from sklearn.exceptions import InconsistentVersionWarning

from app.config import MODEL_FILE_PATH
from app.modules.url_features import extract_url_features
from urllib.parse import urlsplit

SUSPICIOUS_WORDS = ("login", "verify", "secure", "account", "update", "bank", "paypal")
# PhiUSIIL dataset coding: 0 = phishing, 1 = legitimate. Set to 1 if your notebook flipped it.
PHISHING_CLASS_LABEL = 0
logger = logging.getLogger(__name__)
modelState = {"isLoaded": False, "model": None}

# Explains a scikit-learn version clash in words a beginner can act on
def build_version_mismatch_message(warning):
    return (
        f"The model was trained with scikit-learn {warning.original_sklearn_version} "
        f"but this computer has {warning.current_sklearn_version}. "
        f"Fix: pip install scikit-learn=={warning.original_sklearn_version}"
    )


# Only load a trusted file from our own models folder, because joblib files can run code when opened
def load_model_file(modelPath):
    with warnings.catch_warnings():
        warnings.simplefilter("error", InconsistentVersionWarning)
        try:
            return joblib.load(modelPath)
        except InconsistentVersionWarning as warning:
            raise RuntimeError(build_version_mismatch_message(warning)) from warning


# A missing or broken file must not crash the server, so we log it and use backup rules
def try_load_model():
    if not MODEL_FILE_PATH.exists():
        logger.warning("No model file at %s - using backup rules.", MODEL_FILE_PATH)
        return None
    try:
        return load_model_file(MODEL_FILE_PATH)
    except Exception as error:
        logger.warning("Could not load model: %s - using backup rules.", error)
        return None


# Reads the file once at first use, because reloading on every scan would be slow
def get_model():
    if not modelState["isLoaded"]:
        modelState["model"] = try_load_model()
        modelState["isLoaded"] = True
    return modelState["model"]


# The model expects a one-row table with columns in the exact trained order
def build_feature_row(featureNames, url):
    features = extract_url_features(url)
    missingNames = [name for name in featureNames if name not in features]
    if missingNames:
        raise ValueError("extract_url_features is missing: " + ", ".join(missingNames))
    return pd.DataFrame([features], columns=featureNames)


# Shared by model and backup rules so labels always match the score
def pick_label(trustScore):
    if trustScore < 40:
        return "phishing"
    if trustScore < 70:
        return "suspicious"
    return "legitimate"


# Finds which probability column means phishing, because the label coding depends on the dataset
def find_phishing_column(pipeline):
    classLabels = list(pipeline.classes_)
    return classLabels.index(PHISHING_CLASS_LABEL)


# Asks the real model and reads the phishing column by its class label, not by position
def score_with_model(modelBundle, url):
    pipeline = modelBundle["pipeline"]
    featureRow = build_feature_row(modelBundle["features"], url)
    phishingColumn = find_phishing_column(pipeline)
    phishingChance = float(pipeline.predict_proba(featureRow)[0][phishingColumn])
    trustScore = round((1 - phishingChance) * 100)
    confidence = round(max(phishingChance, 1 - phishingChance), 2)
    return {"score": trustScore, "label": pick_label(trustScore), "confidence": confidence, "source": "model"}


# A word list check keeps the backup rules simple and easy to explain
def has_suspicious_word(url):
    lowerUrl = url.lower()
    return any(word in lowerUrl for word in SUSPICIOUS_WORDS)

# Simple warning-sign rules so the demo still works when the model is late or broken
def score_with_rules(url):
    features = extract_url_features(url)
    trustScore = 100
    if features["IsDomainIP"]:
        trustScore -= 30
    if features["HasObfuscation"]:
        trustScore -= 20
    if not features["IsHTTPS"]:
        trustScore -= 15
    if features["URLLength"] > 75:
        trustScore -= 10
    if url.count("-") >= 3:
        trustScore -= 10
    if features["NoOfSubDomain"] >= 3:
        trustScore -= 10
    if has_suspicious_word(url):
        trustScore -= 15
    trustScore = max(trustScore, 0)
    return {"score": trustScore, "label": pick_label(trustScore), "confidence": 0.5, "source": "heuristic"}

# Stops the model from overriding obvious red flags like a raw IP over plain HTTP
def apply_rule_ceiling(modelResult, url):
    ruleResult = score_with_rules(url)
    if ruleResult["score"] < modelResult["score"]:
        modelResult["score"] = ruleResult["score"]
        modelResult["label"] = pick_label(ruleResult["score"])
    return modelResult

# Returns None instead of raising, so the caller can switch to backup rules
def try_model_prediction(url):
    try:
        model = get_model()
        return apply_rule_ceiling(score_with_model(model, url), url) if model is not None else None
    except Exception as error:
        logger.warning("Model prediction failed: %s - using backup rules.", error)
        return None


KNOWN_BRANDS = ("microsoft", "paypal", "google", "amazon", "apple", "facebook", "netflix")
LOOKALIKE_MAX_SCORE = 10


# Reads look-alike letters back as the real ones, so "rnicrosoft" becomes "microsoft"
def undo_lookalike_letters(host):
    return host.replace("rn", "m").replace("vv", "w").replace("0", "o").replace("1", "l")


# Catches fake brand domains that only imitate the real brand name
def is_brand_lookalike(url):
    host = urlsplit(url if "://" in url else "http://" + url).hostname or ""
    cleanedHost = undo_lookalike_letters(host.lower())
    return any(brand in cleanedHost and brand not in host.lower() for brand in KNOWN_BRANDS)


# Marks the result as rule-adjusted so the score and its confidence stay honest
def apply_lookalike_penalty(url, result):
    if is_brand_lookalike(url):
        result["score"] = min(result["score"], LOOKALIKE_MAX_SCORE)
        result["label"] = pick_label(result["score"])
        result["confidence"] = 0.9
        result["source"] = result["source"] + "+lookalike_rule"
    return result


# Module contract entry point: model first, backup rules second, never raises
def predict_with_model(url):
    try:
        modelResult = try_model_prediction(url) or score_with_rules(url)
        return apply_lookalike_penalty(url, modelResult)
    except Exception as error:
        return {"error": f"model: {error}", "score": None}
