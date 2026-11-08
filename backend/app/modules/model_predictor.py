import logging
import warnings

import joblib
from sklearn.exceptions import InconsistentVersionWarning

from app.config import MODEL_FEATURE_NAMES, MODEL_FILE_PATH
from app.modules.url_features import extract_url_features

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


# The model expects numbers in the exact order it was trained with
def build_feature_row(url):
    features = extract_url_features(url)
    missingNames = [name for name in MODEL_FEATURE_NAMES if name not in features]
    if missingNames:
        raise ValueError("extract_url_features is missing: " + ", ".join(missingNames))
    return [features[name] for name in MODEL_FEATURE_NAMES]


# Shared by model and backup rules so labels always match the score
def pick_label(trustScore):
    if trustScore < 40:
        return "phishing"
    if trustScore < 70:
        return "suspicious"
    return "legitimate"


# Asks the real model; assumes class 1 means phishing (confirm with the ML teammate)
def score_with_model(model, url):
    phishingChance = float(model.predict_proba([build_feature_row(url)])[0][1])
    trustScore = round((1 - phishingChance) * 100)
    confidence = round(max(phishingChance, 1 - phishingChance), 2)
    return {"score": trustScore, "label": pick_label(trustScore), "confidence": confidence, "source": "model"}


# Simple warning-sign rules so the demo still works when the model is late or broken
def score_with_rules(url):
    features = extract_url_features(url)
    trustScore = 100
    if features["has_ip_address"]:
        trustScore -= 30
    if features["has_at_symbol"]:
        trustScore -= 20
    if not features["uses_https"]:
        trustScore -= 15
    if features["url_length"] > 75:
        trustScore -= 10
    if features["hyphen_count"] >= 3:
        trustScore -= 10
    if features["subdomain_count"] >= 3:
        trustScore -= 10
    if features["has_suspicious_word"]:
        trustScore -= 15
    return {"score": trustScore, "label": pick_label(trustScore), "confidence": 0.5, "source": "heuristic"}


# Returns None instead of raising, so the caller can switch to backup rules
def try_model_prediction(url):
    try:
        model = get_model()
        return score_with_model(model, url) if model is not None else None
    except Exception as error:
        logger.warning("Model prediction failed: %s - using backup rules.", error)
        return None


# Module contract entry point: model first, backup rules second, never raises
def predict_with_model(url):
    modelResult = try_model_prediction(url)
    if modelResult is not None:
        return modelResult
    try:
        return score_with_rules(url)
    except Exception as error:
        return {"error": f"model: {error}", "score": None}
