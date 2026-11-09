import csv
import io
import os
import re
import sqlite3
import time
import urllib.request
from pathlib import Path
from urllib.parse import urlparse
import urllib.error

REPO_ROOT = Path(__file__).resolve().parent.parent
DATABASE_PATH = REPO_ROOT / "data" / "intel.db"
SCHEMA_PATH = REPO_ROOT / "data" / "schema.sql"
CACHE_FOLDER = REPO_ROOT / "data" / "feed_cache"

CACHE_HOURS = 6
DOWNLOAD_TIMEOUT_SECONDS = 20
MAX_ENTRIES_PER_FEED = 50000
USER_AGENT = "threat-intel-hackathon/1.0"


# Opens the shared database and creates the tables if Node has not done it yet.
def open_database():
    connection = sqlite3.connect(DATABASE_PATH, timeout=10)
    connection.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
    return connection


# Skips re-downloading so we never hammer the free feed servers.
def is_cache_fresh(cache_path):
    if not cache_path.exists():
        return False
    age_seconds = time.time() - cache_path.stat().st_mtime
    return age_seconds < CACHE_HOURS * 3600


# Fetches one feed over HTTPS with a time limit.
def download_text(url, extra_headers):
    headers = {"User-Agent": USER_AGENT, **extra_headers}
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=DOWNLOAD_TIMEOUT_SECONDS) as response:
        return response.read().decode("utf-8", errors="replace")


# Lets the demo keep working with old data when a feed is down.
def read_stale_cache(cache_path):
    if cache_path.exists():
        print("  download failed, using the older cached copy")
        return cache_path.read_text(encoding="utf-8", errors="replace")
    return None


# Returns the feed text from cache if fresh, otherwise downloads, caches and returns it.
def get_feed_text(feed):
    cache_path = CACHE_FOLDER / f"{feed['name']}.txt"
    if is_cache_fresh(cache_path):
        print("  cache is fresh, skipping download")
        return cache_path.read_text(encoding="utf-8", errors="replace")
    try:
        text = download_text(feed["url"], feed["headers"])
    except urllib.error.HTTPError as error:
        print(f"  download error: HTTP {error.code} {error.reason}")
        return read_stale_cache(cache_path)
    except Exception as error:
        print(f"  download error: {type(error).__name__}")
        return read_stale_cache(cache_path)
    cache_path.write_text(text, encoding="utf-8")
    return text

# Reads feeds that are just one URL per line (OpenPhish, URLhaus).
def parse_plain_url_list(text):
    lines = [line.strip() for line in text.splitlines()]
    return [line for line in lines if line.startswith(("http://", "https://"))]


# Reads the PhishTank CSV and keeps only the url column.
def parse_phishtank_csv(text):
    rows = csv.DictReader(io.StringIO(text))
    return [row["url"].strip() for row in rows if row.get("url")]


# Cleans a hostname the same way the Node gateway does, so lookups match.
def get_domain(url):
    try:
        hostname = urlparse(url).hostname
    except ValueError:
        return None
    if not hostname:
        return None
    cleanDomain = hostname.lower().rstrip(".")
    if cleanDomain.startswith("www."):
        cleanDomain = cleanDomain[4:]
    looksLikeDomain = re.fullmatch(r"[a-z0-9-]+(\.[a-z0-9-]+)+", cleanDomain)
    return cleanDomain if looksLikeDomain and len(cleanDomain) <= 253 else None


# Pairs every URL with its domain and drops junk lines.
def build_rows(source_name, urls):
    rows = []
    for url in urls[:MAX_ENTRIES_PER_FEED]:
        domain = get_domain(url)
        if domain:
            rows.append((url, domain, source_name))
    return rows


# Inserts rows and ignores ones we already have, so re-running is safe.
def save_rows(connection, rows):
    changesBefore = connection.total_changes
    connection.executemany(
        "INSERT OR IGNORE INTO feed_entries (url, domain, source) VALUES (?, ?, ?)", rows
    )
    connection.commit()
    return connection.total_changes - changesBefore


# Lists the feeds to load; PhishTank and URLhaus keys are optional.
def get_feed_sources():
    feeds = [
        {"name": "openphish", "url": "https://openphish.com/feed.txt",
         "headers": {}, "parser": parse_plain_url_list},
        {"name": "urlhaus", "url": "https://urlhaus.abuse.ch/downloads/text_online/",
         "headers": {}, "parser": parse_plain_url_list},
    ]
    urlhausKey = os.environ.get("URLHAUS_AUTH_KEY")
    if urlhausKey:
        feeds[1]["headers"] = {"Auth-Key": urlhausKey}
    phishtankKey = os.environ.get("PHISHTANK_API_KEY")
    if phishtankKey:
        feeds.append({"name": "phishtank",
                      "url": f"http://data.phishtank.com/data/{phishtankKey}/online-valid.csv",
                      "headers": {"User-Agent": "phishtank/hackathon"},
                      "parser": parse_phishtank_csv})
    return feeds


# Downloads, parses and saves one feed, and never stops the other feeds.
def load_one_feed(connection, feed):
    print(f"{feed['name']}:")
    text = get_feed_text(feed)
    if text is None:
        print("  skipped, no data available")
        return
    rows = build_rows(feed["name"], feed["parser"](text))
    newCount = save_rows(connection, rows)
    print(f"  {len(rows)} valid entries, {newCount} new")


# Shows the final totals so you can see the load worked.
def print_totals(connection):
    query = "SELECT source, COUNT(*) FROM feed_entries GROUP BY source"
    print("Totals in database:")
    for source, total in connection.execute(query):
        print(f"  {source}: {total}")


# Runs every feed once; safe to run again any time.
def main():
    CACHE_FOLDER.mkdir(parents=True, exist_ok=True)
    connection = open_database()
    for feed in get_feed_sources():
        load_one_feed(connection, feed)
    print_totals(connection)
    connection.close()


main()