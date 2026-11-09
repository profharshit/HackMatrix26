const express = require("express");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const { allowedCategories, normalizeDomain, parseUrl, cleanComment } = require("../validators");

// Builds a per-IP limiter so one person cannot spam a single endpoint.
function createLimiter(maxRequests, windowMinutes, errorMessage) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: errorMessage },
  });
}

// Stores only a one-way hash of the IP so we can stop double votes without saving IPs.
function hashVoter(request) {
  return crypto.createHash("sha256").update(request.ip).digest("hex");
}

// Finds the same url and category reported in the last 24 hours, to block copy-paste spam.
function findRecentDuplicate(database, url, category) {
  return database
    .prepare(`SELECT id FROM reports
              WHERE url = ? AND category = ? AND created_at > datetime('now', '-1 day')`)
    .get(url, category);
}

// Saves a new scam report, or returns the existing one if it is a duplicate.
function handleReport(database) {
  return (request, response) => {
    const { url: rawUrl, category, comment } = request.body || {};
    const parsedUrl = parseUrl(rawUrl);
    if (!parsedUrl) {
      return response.status(400).json({ error: "url must be a valid http or https address" });
    }
    if (!allowedCategories.includes(category)) {
      return response.status(400).json({ error: `category must be one of: ${allowedCategories.join(", ")}` });
    }
    const duplicate = findRecentDuplicate(database, parsedUrl.url, category);
    if (duplicate) {
      return response.status(200).json({ report_id: duplicate.id, duplicate: true });
    }
    const result = database
      .prepare("INSERT INTO reports (url, domain, category, comment) VALUES (?, ?, ?, ?)")
      .run(parsedUrl.url, parsedUrl.domain, category, cleanComment(comment));
    response.status(201).json({ report_id: Number(result.lastInsertRowid), duplicate: false });
  };
}

// Records one up or down vote on an existing report.
function handleVote(database) {
  return (request, response) => {
    const { report_id: reportId, vote } = request.body || {};
    if (!Number.isInteger(reportId)) {
      return response.status(400).json({ error: "report_id must be a whole number" });
    }
    if (vote !== 1 && vote !== -1) {
      return response.status(400).json({ error: "vote must be 1 or -1" });
    }
    const report = database.prepare("SELECT id FROM reports WHERE id = ?").get(reportId);
    if (!report) {
      return response.status(404).json({ error: "Report not found" });
    }
    try {
      database
        .prepare("INSERT INTO votes (report_id, vote, voter_hash) VALUES (?, ?, ?)")
        .run(reportId, vote, hashVoter(request));
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return response.status(409).json({ error: "You already voted on this report" });
      }
      throw error;
    }
    response.status(201).json({ ok: true });
  };
}

// Counts reports, votes and feed hits for one domain.
function handleIntel(database) {
  return (request, response) => {
    const domain = normalizeDomain(request.params.domain);
    if (!domain) {
      return response.status(400).json({ error: "domain is not valid, example: example.com" });
    }
    const reportCount = database
      .prepare("SELECT COUNT(*) AS total FROM reports WHERE domain = ?")
      .get(domain).total;
    const voteCounts = database
      .prepare(`SELECT COALESCE(SUM(votes.vote = 1), 0) AS upvotes,
                       COALESCE(SUM(votes.vote = -1), 0) AS downvotes
                FROM votes JOIN reports ON reports.id = votes.report_id
                WHERE reports.domain = ?`)
      .get(domain);
    const feedsHit = database
      .prepare("SELECT DISTINCT source FROM feed_entries WHERE domain = ?")
      .all(domain)
      .map((row) => row.source);
    response.json({ domain, reports: reportCount, ...voteCounts, feeds_hit: feedsHit });
  };
}

// Connects each URL path to its limiter and handler function.
function createIntelRouter(database) {
  const router = express.Router();
  const reportLimiter = createLimiter(5, 10, "Too many reports, try again in 10 minutes");
  const voteLimiter = createLimiter(30, 10, "Too many votes, try again in 10 minutes");
  router.post("/report", reportLimiter, handleReport(database));
  router.post("/vote", voteLimiter, handleVote(database));
  router.get("/intel/:domain", handleIntel(database));
  return router;
}

module.exports = { createIntelRouter };