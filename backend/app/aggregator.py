from app.config import (
    SAFE_MIN_SCORE,
    SCORE_WEIGHTS,
    SCORE_WHEN_ALL_CHECKS_FAIL,
    SUSPICIOUS_MIN_SCORE,
    MIN_WORKING_MODULES_FOR_SAFE,
)


# Failed modules have no score, so we skip them instead of letting them drag the total to zero
def find_working_modules(breakdown):
    return [name for name in SCORE_WEIGHTS if breakdown[name].get("score") is not None]


# Too few finished checks is weak evidence, so the score may never reach "safe"
def cap_score_when_evidence_is_thin(trustScore, workingCount):
    if workingCount < MIN_WORKING_MODULES_FOR_SAFE:
        return min(trustScore, SAFE_MIN_SCORE - 1)
    return trustScore


# Weighted average over the working modules, re-scaled so their weights still add up to 100%
def calculate_trust_score(breakdown):
    workingModules = find_working_modules(breakdown)
    if not workingModules:
        return SCORE_WHEN_ALL_CHECKS_FAIL
    totalWeight = sum(SCORE_WEIGHTS[name] for name in workingModules)
    weightedSum = sum(breakdown[name]["score"] * SCORE_WEIGHTS[name] for name in workingModules)
    trustScore = round(weightedSum / totalWeight)
    return cap_score_when_evidence_is_thin(trustScore, len(workingModules))

# Turns the number into the label the frontend shows
def pick_verdict(trustScore):
    if trustScore >= SAFE_MIN_SCORE:
        return "safe"
    if trustScore >= SUSPICIOUS_MIN_SCORE:
        return "suspicious"
    return "dangerous"


# Certificate and web security modules already describe their own problems
def collect_issue_reasons(breakdown):
    certificateIssues = breakdown["certificate"].get("issues", [])
    webSecurityIssues = breakdown["web_security"].get("issues", [])
    return certificateIssues + webSecurityIssues


# Only mentions the AI model when it actually raised a concern
def collect_model_reasons(breakdown):
    modelResult = breakdown["model"]
    modelScore = modelResult.get("score")
    if modelScore is None or modelScore >= SAFE_MIN_SCORE:
        return []
    confidence = modelResult.get("confidence", 0)
    return [f"AI model flags this URL as {modelResult.get('label')} ({confidence:.0%} confidence)"]


# Community reports and feed matches are the strongest human-readable evidence
def collect_threat_intel_reasons(breakdown):
    reasons = []
    intel = breakdown["threat_intel"]
    if intel.get("reports", 0) > 0:
        reasons.append(f"{intel['reports']} user report(s) against this domain")
    if intel.get("feeds_hit"):
        reasons.append("Listed in threat feeds: " + ", ".join(intel["feeds_hit"]))
    return reasons


# Tells the user when a check was skipped, so a missing check is never silent
def collect_failure_reasons(breakdown):
    reasons = []
    for name in SCORE_WEIGHTS:
        if "error" in breakdown[name]:
            reasons.append(f"Check could not finish ({breakdown[name]['error']})")
    return reasons


# Explains why a safe site still lists warnings, so the result does not look contradictory
def build_summary_reason(trustScore):
    if trustScore >= SAFE_MIN_SCORE:
        return ["Overall safe. The notes below are minor hardening gaps, not signs of a scam."]
    return []


# Builds the plain-English list the frontend shows under the score
def build_reasons(breakdown, trustScore):
    return (
        build_summary_reason(trustScore)
        + collect_model_reasons(breakdown)
        + collect_threat_intel_reasons(breakdown)
        + collect_issue_reasons(breakdown)
        + collect_failure_reasons(breakdown)
    )