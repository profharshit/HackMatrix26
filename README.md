# Web Threat Detection & Digital Trust Intelligence

Scans a URL passively (no port scanning, no active probing) and returns a Digital Trust Score (0-100) with a breakdown and plain-English reasons.


API contract for frontend/ML teammates: [`openapi.yaml`](openapi.yaml)
Paste it into https://editor.swagger.io to read it as a web page.

## How it fits together

- **FastAPI (`backend/`)** is the brain: runs the scan and combines the scores.
- **Node Express (`gateway/`)** is the gateway: CORS, rate limits, scam reports, votes and threat-intel lookups.
- **SQLite (`data/intel.db`)** is the shared threat-intel database. Node writes reports and votes; `scripts/load_feeds.py` loads public phishing feeds.

## How a scan works

1. `POST /api/scan` receives a URL.
2. Four checks run at the same time (5-second limit each): AI model, certificate, web security, threat intel.
3. A failed or slow check is skipped, never crashes the scan.
4. Scores are combined with weights from `backend/app/config.py` into one `trust_score` (100 = safe), a `verdict` and a `reasons` list.

Current status: certificate, web security and threat intel inside FastAPI are **stubs with fake data** until the real modules are added. The model uses simple backup rules until `model.joblib` is provided. The gateway forwards `/api/scan` to FastAPI.

## Project layout

```
repo-root/
├── README.md
├── openapi.yaml                 # API contract (source of truth for React + ML)
├── .gitignore
├── data/
│   ├── schema.sql               # tables: reports, votes, feed_entries
│   ├── intel.db                 # created automatically (not in Git)
│   └── feed_cache/              # downloaded feed copies (not in Git)
├── scripts/
│   └── load_feeds.py            # loads OpenPhish, URLhaus, PhishTank into the database
├── gateway/                     # Node Express server
│   ├── package.json
│   └── src/
│       ├── server.js            # starts Express: helmet, CORS, rate limit, /health
│       ├── db.js                # opens intel.db and creates tables
│       ├── initDb.js            # creates the database by hand to test the schema
│       ├── validators.js        # cleans URLs, domains and comments
│       └── routes/
│           ├── intel.js         # /api/report, /api/vote, /api/intel/:domain
│           └── scan.js          # forwards /api/scan to FastAPI
└── backend/                     # FastAPI
    ├── requirements.txt
    ├── app/
    │   ├── main.py              # starts FastAPI, enables CORS, /health
    │   ├── config.py            # weights, timeouts, verdict limits, model path
    │   ├── orchestrator.py      # runs the 4 modules in parallel and merges results
    │   ├── aggregator.py        # weighted trust score, verdict, reasons list
    │   ├── routers/scan.py      # POST /api/scan, GET /api/scan/{id}
    │   ├── modules/
    │   │   ├── model_predictor.py   # loads model.joblib, backup rules if missing
    │   │   ├── url_features.py      # turns a URL into numbers for the model
    │   │   ├── certificate.py       # STUB
    │   │   ├── web_security.py      # STUB
    │   │   └── threat_intel.py      # STUB
    │   └── models/              # put the ML teammate's model.joblib here
    └── tests/
```

```
recent change in gateway/src/server.js (2 changed lines):
const port = process.env.PORT || 4000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:3000").split(",");
```

## Run on Windows (PowerShell)

Needs Python 3.13 and Node.js LTS (20 or newer). Open a separate PowerShell window for each part.

**Backend (FastAPI), first time:**

```powershell
cd backend
py -3.13 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Next time: `cd backend`, `.venv\Scripts\activate`, `uvicorn app.main:app --reload`.
If activate is blocked, run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

**Gateway (Node), first time:**

```powershell
cd gateway
npm install
npm start
```

Next time: `cd gateway`, `npm start`. Always run `npm` commands inside `gateway`.

**Load public phishing feeds (re-runnable):**

```powershell
py scripts\load_feeds.py
```

Feeds are cached for 6 hours, so running it again will not re-download. Optional keys: `$env:PHISHTANK_API_KEY` and `$env:URLHAUS_AUTH_KEY`. To force a fresh download: `Remove-Item data\feed_cache -Recurse`.

Stop any server with `Ctrl+C`.

## Try it

- Backend health: http://127.0.0.1:8000/health
- Backend interactive page: http://127.0.0.1:8000/docs
- Gateway health: http://localhost:4000/health

```powershell
# Submit a scam report
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/report -ContentType "application/json" -Body '{"url":"http://fake-bank.example/login","category":"phishing","comment":"asks for OTP"}'

# Vote on it (use the report_id you got back)
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/vote -ContentType "application/json" -Body '{"report_id":1,"vote":1}'

# Look up a domain
Invoke-RestMethod http://localhost:4000/api/intel/fake-bank.example

# Scan a URL (through the gateway)
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/scan -ContentType "application/json" -Body '{"url": "https://example.com"}'
```

## Gateway endpoints

| Method | Path | What it does |
|---|---|---|
| POST | `/api/report` | Save a scam report `{url, category, comment}`. Returns `report_id` and `duplicate`. |
| POST | `/api/vote` | Vote `1` or `-1` on a report `{report_id, vote}`. One vote per person per report. |
| POST | `/api/scan` | Forwards `{url}` to FastAPI and returns its answer unchanged. 15-second limit. |
| GET | `/api/intel/:domain` | Report count, up/down votes and feeds that list the domain. |
| GET | `/health` | Returns `{"status":"ok"}`. |

Categories: `phishing`, `fake_payment`, `fake_recruitment`, `impersonation`, `malware`, `other`.

## Abuse protection

- All requests: 100 per minute per IP. Reports: 5 per 10 minutes. Votes: 30 per 10 minutes.
- The same URL and category reported within 24 hours returns the existing report instead of a new one.
- Domains are stored lowercase without `www.` or a trailing dot. Anything that looks up the database (including `get_threat_intel`) must clean the domain the same way.
- Voters are stored as a one-way hash of the IP, never the IP itself.

## Adding the ML model

1. Copy the file to `backend/app/models/model.joblib`.
2. Set the exact scikit-learn version from your ML teammate in `requirements.txt` (for example `scikit-learn==1.5.2`) and run `pip install -r requirements.txt`.
3. Put their ordered feature names in `MODEL_FEATURE_NAMES` in `config.py`.
4. Restart the server. The scan result shows `"source": "model"` when it works, or `"heuristic"` when backup rules are used (the reason is printed in the terminal).

Only load a model file from a trusted teammate. Joblib files can run code when opened.

## Tuning

All in `backend/app/config.py`: module weights (`SCORE_WEIGHTS`), verdict limits, timeout.

## Rules
- Passive checks only (no port scanning, no active probing).
- Every module has a 5-second timeout and never crashes the scan.
- Every module score means 100 = looks safe, 0 = looks dangerous.