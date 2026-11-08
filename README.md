# Web Threat Detection & Digital Trust Intelligence (Backend)

FastAPI backend that scans a URL (passively, no port scanning) and returns a Digital Trust Score (0-100) with a breakdown and plain-English reasons.

API contract for frontend/ML teammates: [`openapi.yaml`](openapi.yaml)
Paste it into https://editor.swagger.io to read it as a web page.

## How a scan works

1. `POST /api/scan` receives a URL.
2. Four checks run at the same time (5-second limit each): AI model, certificate, web security, threat intel.
3. A failed or slow check is skipped, never crashes the scan.
4. Scores are combined with weights from `backend/app/config.py` into one `trust_score` (100 = safe), a `verdict` and a `reasons` list.

Current status: certificate, web security and threat intel are **stubs with fake data** until the real modules are added. The model uses simple backup rules until `model.joblib` is provided.

## Project layout

```
repo-root/
├── README.md
├── openapi.yaml                 # API contract (source of truth for React + ML)
├── .gitignore
└── backend/
    ├── requirements.txt         # Python packages
    ├── app/
    │   ├── main.py              # starts FastAPI, enables CORS, /health
    │   ├── config.py            # weights, timeouts, verdict limits, model path (tune here)
    │   ├── orchestrator.py      # runs the 4 modules in parallel and merges results
    │   ├── aggregator.py        # weighted trust score, verdict, reasons list
    │   ├── routers/
    │   │   └── scan.py          # POST /api/scan, GET /api/scan/{id}
    │   ├── modules/
    │   │   ├── model_predictor.py   # loads model.joblib, backup rules if missing
    │   │   ├── url_features.py      # turns a URL into numbers for the model
    │   │   ├── certificate.py       # STUB
    │   │   ├── web_security.py      # STUB
    │   │   └── threat_intel.py      # STUB
    │   └── models/              # put the ML teammate's model.joblib here
    └── tests/                   # quick tests
```

## Run on Windows (PowerShell, Python 3.13)

```powershell
cd backend
py -3.13 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

If activate is blocked, run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

Next time, only run: `cd backend`, `.venv\Scripts\activate`, `uvicorn app.main:app --reload`.

## Try it

- Health check: http://127.0.0.1:8000/health
- Interactive API page: http://127.0.0.1:8000/docs
  1. Click `POST /api/scan` > **Try it out**
  2. Enter `{"url": "https://example.com"}` > **Execute**
- Or from PowerShell:

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/api/scan `
  -ContentType "application/json" -Body '{"url": "https://example.com"}'
```

Stop the server with `Ctrl+C`.

## ThreatWho AI (Frontend)

Minimalist editorial web application built with JavaScript (React + Vite + Tailwind CSS) following the HackMatrix '26 specifications:
- **Base Palette**: Solid white, warm paper grey (`#faf9f6`), and deep navy blue (`#0f172a`).
- **Strictly No Gradients**: Solid surfaces, crisp borders, and high-contrast typography.
- **Drawer Architecture**: Collapsible `MENU ☰` navigation drawer plus slide-out Diagnostic Forensic Inspector drawer.
- **Guest Access**: 100% accessible to guests without mandatory login; optional login modal with 1-click test personas for evaluation.
- **eMudhra Incident Audit**: Dedicated cryptographic analysis covering Certificate Authority key generation vulnerabilities and Certificate Transparency.

### Run Frontend in Development

```powershell
cd frontend
npm install
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

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
