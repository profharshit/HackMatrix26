-- Stores every scam report that a user submits.
CREATE TABLE IF NOT EXISTS reports (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    url         TEXT NOT NULL,
    domain      TEXT NOT NULL,
    category    TEXT NOT NULL,
    comment     TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Stores up/down votes on a report (+1 or -1), one vote per voter per report.
CREATE TABLE IF NOT EXISTS votes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id   INTEGER NOT NULL REFERENCES reports(id),
    vote        INTEGER NOT NULL CHECK (vote IN (1, -1)),
    voter_hash  TEXT NOT NULL,
    UNIQUE (report_id, voter_hash)
);

-- Stores URLs and domains from public phishing feeds (OpenPhish, URLhaus, PhishTank).
CREATE TABLE IF NOT EXISTS feed_entries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    url         TEXT NOT NULL,
    domain      TEXT NOT NULL,
    source      TEXT NOT NULL,
    added_at    TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (url, source)
);

CREATE INDEX IF NOT EXISTS idx_reports_domain ON reports(domain);
CREATE INDEX IF NOT EXISTS idx_feed_entries_domain ON feed_entries(domain);