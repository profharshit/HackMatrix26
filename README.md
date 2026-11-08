# Web Threat Detection & Digital Trust Intelligence (Backend)

FastAPI backend that scans a URL (passively, no port scanning) and returns a Digital Trust Score (0-100) with reasons.

API contract for frontend/ML teammates: [`openapi.yaml`](openapi.yaml)
Paste it into https://editor.swagger.io to read it as a web page.

## Project layout

```
repo-root/
├── README.md
├── openapi.yaml            # API contract (source of truth for React + ML)
├── .gitignore
└── backend/
    ├── requirements.txt    # Python packages
    ├── app/
    │   ├── main.py         # starts FastAPI, enables CORS
    │   ├── config.py       # weights, timeouts (tune here)
    │   ├── routers/        # URL endpoints (/api/scan, /api/report ...)
    │   ├── modules/        # the 4 checkers: model, certificate, web security, threat intel
    │   └── models/         # put the teammate's .joblib file here
    └── tests/              # quick tests
```

## Run on Windows (PowerShell)

```powershell
cd backend
py -3.12 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

If activate is blocked, run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

Open http://127.0.0.1:8000/docs (interactive API page) and http://127.0.0.1:8000/health.

## Rules
- Passive checks only.
- Every module has a 5-second timeout and never crashes the scan.
