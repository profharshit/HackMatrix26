#!/usr/bin/env bash
# Fills the feed table first so threat intel is never empty, then runs both services on one machine.
python scripts/load_feeds.py || echo "Feed load failed, continuing"
(cd backend && uvicorn app.main:app --host 127.0.0.1 --port 8000) &
cd gateway && node src/server.js