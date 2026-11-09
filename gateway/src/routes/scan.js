// File: gateway/src/routes/scan.js
// Mount in server.js (after express.json and the rate limiter) with:
//   const scanRoutes = require("./routes/scan");
//   app.use("/api", scanRoutes);
// Needs Node 20+ (built-in fetch). No new packages.

const express = require("express");

const router = express.Router();

const FASTAPI_BASE_URL = process.env.FASTAPI_URL || "http://localhost:8000";
// A scan runs four checks in parallel at up to 5 seconds each, so allow some extra time
const SCAN_TIMEOUT_MS = 15000;
const MAX_URL_LENGTH = 2048;

// Rejects empty or oversized input here so FastAPI never sees obvious junk
function hasValidUrl(body) {
  if (!body || typeof body.url !== "string") return false;
  const trimmedUrl = body.url.trim();
  return trimmedUrl.length > 0 && trimmedUrl.length <= MAX_URL_LENGTH;
}

// Forwards the scan request to FastAPI and gives up after the timeout
function sendToFastApi(body) {
  return fetch(`${FASTAPI_BASE_URL}/api/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(SCAN_TIMEOUT_MS),
  });
}

// Turns a low-level network failure into a status and message the frontend can show
function describeForwardError(error) {
  if (error.name === "TimeoutError") {
    return { status: 504, message: "The scan took too long. Please try again." };
  }
  return { status: 502, message: "The scan service is unavailable right now." };
}

// Single entry point the React app calls to scan a URL
router.post("/scan", async (req, res) => {
  if (!hasValidUrl(req.body)) {
    return res.status(400).json({ error: "Please send a JSON body like {\"url\": \"https://example.com\"}." });
  }

  try {
    const fastApiResponse = await sendToFastApi(req.body);
    const responseText = await fastApiResponse.text();
    res.status(fastApiResponse.status).type("application/json").send(responseText);
  } catch (error) {
    console.error("Scan forwarding failed:", error.message);
    const { status, message } = describeForwardError(error);
    res.status(status).json({ error: message });
  }
});

module.exports = router;