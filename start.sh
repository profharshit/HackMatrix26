#!/usr/bin/env bash
# Prepares the mounted data folder, then runs feed loading, FastAPI and the gateway on one machine.
mkdir -p /app/data/feed_cache
cp -n /app/seed/schema.sql /app/data/schema.sql
(python scripts/load_feeds.py || echo "Feed load failed, continuing") &
(cd backend && uvicorn app.main:app --host 127.0.0.1 --port 8000) &
cd gateway && node src/server.js