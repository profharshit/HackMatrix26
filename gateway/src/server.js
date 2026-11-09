const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { openDatabase } = require("./db");
const { createIntelRouter } = require("./routes/intel");
const scanRoutes = require("./routes/scan");

const port = Number(process.env.PORT) || 4000;
const defaultOrigins = "http://localhost:5173,http://localhost:3000";

// Adds the live Vercel site to the allowed origins so the browser is not blocked by CORS.
function buildAllowedOrigins() {
  const configuredOrigins = process.env.ALLOWED_ORIGINS || defaultOrigins;
  const origins = configuredOrigins.split(",").map((origin) => origin.trim());
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL.trim().replace(/\/$/, ""));
  }
  return origins;
}

// Returns a clear JSON error instead of an HTML crash page.
function handleErrors(error, request, response, next) {
  if (error.type === "entity.parse.failed") {
    return response.status(400).json({ error: "Request body is not valid JSON" });
  }
  console.error(error);
  response.status(500).json({ error: "Something went wrong on the server" });
}

// Builds the app with security middleware first, then the routes.
function createApp(database) {
  const app = express();
  // Behind Fly's proxy every request looks like one IP unless we trust the proxy header.
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: buildAllowedOrigins() }));
  app.use(express.json({ limit: "10kb" }));
  app.use(rateLimit({ windowMs: 60 * 1000, limit: 100 }));
  app.get("/health", (request, response) => response.json({ status: "ok" }));
  app.use("/api", createIntelRouter(database));
  app.use("/api", scanRoutes);
  app.use(handleErrors);
  return app;
}

// Starts listening on all interfaces so the hosting platform can reach the gateway.
function startServer() {
  const app = createApp(openDatabase());
  app.listen(port, "0.0.0.0", () => console.log(`Gateway running on port ${port}`));
}

startServer();