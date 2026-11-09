import sqlite3
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
DATABASE_PATH = REPO_ROOT / "data" / "intel.db"

DATABASE_TIMEOUT_SECONDS = 5
FIRST_FEED_PENALTY = 70
EXTRA_FEED_PENALTY = 10
REPORT_PENALTY = 10
MAX_REPORT_PENALTY = 30


# Cleans the domain the same way the Node gateway does so lookups match.
def clean_domain(rawDomain):
    domain = str(rawDomain).strip().lower().rstrip(".")
    if domain.startswith("www."):
        domain = domain[4:]
    return domain


# Opens the shared database read-only so a scan can never change intel data.
def open_database_read_only():
    databaseUri = DATABASE_PATH.as_uri() + "?mode=ro"
    return sqlite3.connect(databaseUri, uri=True, timeout=DATABASE_TIMEOUT_SECONDS)


# Lists which public feeds mention this domain.
def find_feeds_hit(connection, domain):
    query = "SELECT DISTINCT source FROM feed_entries WHERE domain = ? ORDER BY source"
    return [row[0] for row in connection.execute(query, (domain,))]


# Gets every report for the domain together with its up and down vote counts.
def load_reports_with_votes(connection, domain):
    query = """
        SELECT r.id,
               COALESCE(SUM(CASE WHEN v.vote = 1 THEN 1 ELSE 0 END), 0),
               COALESCE(SUM(CASE WHEN v.vote = -1 THEN 1 ELSE 0 END), 0)
        FROM reports r
        LEFT JOIN votes v ON v.report_id = r.id
        WHERE r.domain = ?
        GROUP BY r.id
    """
    return connection.execute(query, (domain,)).fetchall()


# Lets the crowd cancel a false report: it counts only if up-votes are not outnumbered.
def count_trusted_reports(reportRows):
    return sum(1 for reportId, upVotes, downVotes in reportRows if upVotes >= downVotes)


# Feeds are vetted by professionals, so they carry the heaviest penalty.
def calculate_feed_penalty(feedsHit):
    if not feedsHit:
        return 0
    return FIRST_FEED_PENALTY + EXTRA_FEED_PENALTY * (len(feedsHit) - 1)


# Caps the report penalty so spam cannot sink a clean site.
def calculate_report_penalty(trustedReportCount):
    return min(MAX_REPORT_PENALTY, REPORT_PENALTY * trustedReportCount)


# Adds up all the votes so the reasons list can explain the score.
def sum_votes(reportRows):
    totalUpVotes = sum(row[1] for row in reportRows)
    totalDownVotes = sum(row[2] for row in reportRows)
    return totalUpVotes, totalDownVotes


# Builds the contract dictionary from the numbers we collected.
def build_result(feedsHit, reportRows):
    trustedReports = count_trusted_reports(reportRows)
    feedPenalty = calculate_feed_penalty(feedsHit)
    reportPenalty = calculate_report_penalty(trustedReports)
    upVotes, downVotes = sum_votes(reportRows)
    return {
        "score": max(0, 100 - feedPenalty - reportPenalty),
        "reports": len(reportRows),
        "feeds_hit": feedsHit,
        "details": {
            "trusted_reports": trustedReports,
            "up_votes": upVotes,
            "down_votes": downVotes,
            "feed_penalty": feedPenalty,
            "report_penalty": reportPenalty,
        },
    }


# Main entry point: reads the database and never raises, as the module contract requires.
def get_threat_intel(domain):
    try:
        cleanName = clean_domain(domain)
        if not cleanName:
            return {"error": "empty domain", "score": None}
        connection = open_database_read_only()
        try:
            feedsHit = find_feeds_hit(connection, cleanName)
            reportRows = load_reports_with_votes(connection, cleanName)
        finally:
            connection.close()
        return build_result(feedsHit, reportRows)
    except Exception as error:
        return {"error": f"threat intel failed: {error}", "score": None}