# ThreatWho AI — Web Threat Detection & Digital Trust Intelligence

[![HackMatrix '26](https://img.shields.io/badge/HackMatrix-'26-blue?style=flat-square)](#)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#)
[![Three.js](https://img.shields.io/badge/Three.js-r134-black?style=flat-square&logo=threedotjs&logoColor=white)](#)

> **ThreatWho AI** is the trust operating system for the modern web. It scans any URL passively (zero port-scanning, zero active probing) and converts four independent forensic checks into a unified **0–100 Digital Trust Score** with plain-English reasons, powered by machine learning, real cryptographic certificate validation, HTTP security auditing, and crowdsourced threat intelligence.

---

## 🏛️ System Architecture

ThreatWho AI employs a resilient, three-tier micro-architecture designed for sub-second responses, fault isolation, and abuse prevention:

```
                           ┌───────────────────────────────┐
                           │      ThreatWho Frontend       │
                           │  Vite + React 18 + Tailwind   │
                           │  Interactive 3D Vanta Canvases│
                           └───────────────┬───────────────┘
                                           │
                                  HTTP / JSON (REST)
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             Node Express Gateway (:4000)                         │
│  - Helmet security headers              - URL & domain canonicalization          │
│  - IP-based rate limiting               - One-way voter IP hashing               │
│  - Scam reporting & voting API          - Threat feed intelligence lookups       │
└──────────────────────┬───────────────────────────────────┬───────────────────────┘
                       │                                   │
              Proxy /api/scan                     Reads / Writes
                       │                                   │
                       ▼                                   ▼
┌──────────────────────────────────────────────┐  ┌────────────────────────────────┐
│             FastAPI Brain (:8000)            │  │      SQLite Database (:data)   │
│  - Parallel Async Orchestrator (5s timeout)  │  │  - Table: `reports`            │
│  - Weighted Deductive Aggregator             │  │  - Table: `votes`              │
│  - Plain-English Reason Compiler             │  │  - Table: `feed_entries`       │
├──────────────────────────────────────────────┤  └────────────────┬───────────────┘
│  [1] AI Lexical URL Predictor                │                   ▲
│      (Subdomains, entropy, impersonation)    │                   │ Ingests public feeds
│  [2] Real TLS/SSL Certificate Analyzer       │                   │ (OpenPhish, URLhaus,
│      (SAN match, CT logs, expiry, issuer)    │                   │  PhishTank)
│  [3] Web Security Headers Analyzer           │  ┌────────────────┴───────────────┐
│      (HSTS, CSP, X-Frame-Options, cookies)   │  │    scripts/load_feeds.py       │
│  [4] Threat Intel Feed Cross-Referencer      │  │    (6-hour automated cache)    │
└──────────────────────────────────────────────┘  └────────────────────────────────┘
```

### Key Architectural Tenets
1. **Zero Scan Failure Guarantee**: Every scan check (AI Model, SSL Certificate, Web Security, Threat Intel) runs concurrently via `asyncio` with an isolated 5-second deadline. If one check hangs or fails, it is skipped without degrading the other signals.
2. **Explainable Trust Aggregation**: Rather than an opaque "blocked" verdict, ThreatWho produces a mathematical score (0 = malicious, 100 = verified safe) where every deducted point is directly tied to an understandable explanation.
3. **Passive-Only Footprint**: ThreatWho reads only what any standard browser can see (DNS, TLS handshakes, HTTP response headers, public feeds). No active vulnerability scans or intrusive probes are performed.
4. **Built-in Offline Resilience**: The frontend includes a fallback demo evaluation engine so researchers and judges can explore the complete product workflow even when running without a live backend connection.

---

## 🎨 New UI/UX Design System

The platform has been redesigned around a **Luxury Cyber Sapphire & Champagne** aesthetic, combining interactive 3D physics with micro-animations.

### 1. Interactive 3D Canvas Ecosystem
The interface features layered Three.js and p5.js canvases that react to mouse and touch movements:

| Section | Engine | Visual Effect | Implementation |
|:---|:---|:---|:---|
| **Hero Section** | p5.js + Vanta.js | **Topology**: 3D fluid wireframe waves (`0xefefef` over `#232e81`) | [`TopologyBackground.jsx`](frontend/src/components/TopologyBackground.jsx) |
| **Three Layers** | Three.js + Vanta.js | **Birds**: Autonomous 3D flocking boids simulation gliding behind layer cards | [`BirdsBackground.jsx`](frontend/src/components/BirdsBackground.jsx) |
| **Platform Modules** | Three.js + Vanta.js | **Dots**: Interactive floating wave grid responding to cursor proximity | [`DotsBackground.jsx`](frontend/src/components/DotsBackground.jsx) |
| **Live Scanner** | Three.js + Vanta.js | **Net**: Constellation neural mesh connecting nodes with soft glow | [`NetBackground.jsx`](frontend/src/components/NetBackground.jsx) |
| **Enterprise CTA** | Three.js + Vanta.js | **Net**: Sapphire constellation backdrop inside the bottom CTA banner | [`NetBackground.jsx`](frontend/src/components/NetBackground.jsx) |

* **Seamless Boundary Feathering**: Hard 1px borders between sections have been eliminated in favor of CSS alpha gradient masks (`maskImage: linear-gradient(...)`) and `backdrop-blur-[2px]` overlays that dissolve every canvas into the background.

### 2. Animated Video Icons (`VideoIcon.jsx`)
Replaces flat static icons with looping, 512×512 animated micro-videos served directly from [`frontend/public/icons/`](frontend/public/icons/):
- **`gear-wrench.mp4`**: AI Model & Lexical Detection engine
- **`key.mp4`**: SSL/TLS Certificate validation & key security
- **`security.mp4`**: Web Security Headers & brand header shield logo
- **`global-education.mp4`**: Threat Intelligence feeds & worldwide domain reputation
- **`3333.mp4` (`report.mp4`)**: Crowdsourced Community Threat Reporting & announcement megaphone

### 3. Uiverse `btn-17` Button System ([`Button.jsx`](frontend/src/components/Button.jsx))
All primary and ghost buttons use the `btn-17` diagonal sliding sweep with rolling text animations:
- Skewed diagonal blades sweep across the button surface on hover.
- Automatic text color inversion powered by `mix-blend-mode: difference`.
- Rolling text keyframe animation (`move-up-alternate 0.3s forwards`).
- Built-in WebKit radial mask clipping to prevent corner overflow artifacts.

---

## 📁 Repository Layout

```
HackMatrix26-main/
├── README.md                          # Master system documentation
├── openapi.yaml                       # OpenAPI 3.0 specification & contract
├── package.json                       # Root workspace scripts
├── .gitignore
│
├── frontend/                          # React + Vite application
│   ├── index.html                     # HTML5 shell (includes Three.js, p5.js, Vanta scripts)
│   ├── package.json                   # Dependencies (React 18, Tailwind, Lucide React)
│   ├── tailwind.config.js             # Theme tokens (ink-900, sapphire, champagne accent)
│   ├── vite.config.js                 # Vite bundler configuration
│   ├── public/
│   │   └── icons/                     # Streaming MP4 animated icons
│   │       ├── 3333.mp4               # Community reporting megaphone
│   │       ├── gear-wrench.mp4        # AI model engine
│   │       ├── global-education.mp4   # Threat intelligence globe
│   │       ├── key.mp4                # Certificate key
│   │       └── security.mp4           # Shield logo
│   └── src/
│       ├── App.jsx                    # Core page orchestrator & backend status polling
│       ├── index.css                  # Global styles, Tailwind base, btn-17 CSS
│       ├── components/
│       │   ├── Hero.jsx               # Hero banner with Vanta Topology & live gauge
│       │   ├── Nav.jsx                # Sticky navigation header & live status pill
│       │   ├── Marquee.jsx            # Continuous threat signal marquee
│       │   ├── Scanner.jsx            # Interactive scan input, gauge, & module breakdown
│       │   ├── Sections.jsx           # Layers, Numbers, Platform tabs, FAQ, CTA, Footer
│       │   ├── ReportForm.jsx         # Community threat reporting form
│       │   ├── Reveal.jsx             # Scroll-triggered entrance animations
│       │   ├── Button.jsx             # Reusable btn-17 sliding button component
│       │   ├── VideoIcon.jsx          # Reusable streaming MP4 icon player
│       │   ├── TopologyBackground.jsx # Vanta Topology wrapper (p5.js)
│       │   ├── BirdsBackground.jsx    # Vanta Birds wrapper (Three.js)
│       │   ├── DotsBackground.jsx     # Vanta Dots wrapper (Three.js)
│       │   └── NetBackground.jsx      # Vanta Net wrapper (Three.js)
│       └── services/
│           ├── api.js                 # API client (automatic fallback to demo engine)
│           └── mockData.js            # Offline simulation targets & threat data
│
├── gateway/                           # Node.js Express API gateway
│   ├── package.json
│   └── src/
│       ├── server.js                  # Express setup: Helmet, CORS, rate limits, /health
│       ├── db.js                      # SQLite database connector & table migrations
│       ├── validators.js              # URL/domain sanitization & voter hashing
│       └── routes/
│           ├── scan.js                # Proxies /api/scan to FastAPI backend
│           └── intel.js               # /api/report, /api/vote, /api/intel/:domain
│
├── backend/                           # FastAPI threat evaluation brain
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py                    # FastAPI application entrypoint
│   │   ├── config.py                  # Module weights, verdict thresholds, timeouts
│   │   ├── orchestrator.py            # Async concurrent execution of 4 checks
│   │   ├── aggregator.py              # Mathematical trust score & reason compiler
│   │   ├── routers/
│   │   │   └── scan.py                # POST /api/scan, GET /api/scan/{id}
│   │   ├── modules/
│   │   │   ├── url_features.py        # 16-point lexical feature extraction
│   │   │   ├── model_predictor.py     # Scikit-learn predictor + heuristic backup
│   │   │   ├── certificate.py         # Real TLS/SSL socket analysis & SAN matching
│   │   │   ├── web_security.py        # HTTP security headers (HSTS, CSP, X-Frame)
│   │   │   └── threat_intel.py        # Blocklist & feed reputation checker
│   │   └── models/                    # ML model artifact storage (`model.joblib`)
│   └── tests/
│
├── data/                              # Data store & schemas
│   ├── schema.sql                     # SQLite database schema DDL
│   ├── intel.db                       # Auto-generated SQLite database (git-ignored)
│   └── feed_cache/                    # 6-hour feed cache directory (git-ignored)
│
└── scripts/
    └── load_feeds.py                  # Threat feed ingest (OpenPhish, URLhaus, PhishTank)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20 LTS or newer (`node -v`)
- **Python**: 3.12 or 3.13 (`python --version` or `py --version`)

---

### Step 1: Start the Backend (FastAPI Brain)

```powershell
cd backend
py -3.13 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
* Interactive Swagger API Docs: **`http://127.0.0.1:8000/docs`**
* Health Check: **`http://127.0.0.1:8000/health`**

---

### Step 2: Start the Gateway (Node.js Express)

In a new terminal window:

```powershell
cd gateway
npm install
npm start
```
* Gateway URL: **`http://localhost:4000`**
* Gateway Health Check: **`http://localhost:4000/health`**

---

### Step 3: Populate Threat Intelligence Feeds (Optional)

In another terminal window:

```powershell
py scripts/load_feeds.py
```
*Downloads and parses verified feeds from OpenPhish, URLhaus, and PhishTank into `data/intel.db` with automated 6-hour caching.*

---

### Step 4: Start the Frontend (Vite + React)

In a new terminal window:

```powershell
cd frontend
npm install
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 📡 Gateway API Reference

| Method | Endpoint | Description | Sample Payload / Params |
|:---|:---|:---|:---|
| `POST` | `/api/scan` | Forwards target URL to FastAPI; returns unified score & breakdown | `{"url": "https://example.com/login"}` |
| `POST` | `/api/report` | Submit crowdsourced scam/threat report | `{"url": "http://scam.org", "category": "phishing", "comment": "Asks for OTP"}` |
| `POST` | `/api/vote` | Upvote (`1`) or downvote (`-1`) a threat report | `{"report_id": 1, "vote": 1}` |
| `GET` | `/api/intel/:domain` | Retrieve community reports, vote count, and known feed hits | `GET /api/intel/example.com` |
| `GET` | `/health` | Gateway health check status | Returns `{"status": "ok"}` |

### Scam Categories
- `phishing`
- `fake_payment`
- `fake_recruitment`
- `impersonation`
- `malware`
- `other`

---

## 🛡️ Security & Abuse Defenses

- **Strict Rate Limiting**: 100 req/min per IP globally. Scam submissions are throttled to 5 per 10 minutes; voting is throttled to 30 per 10 minutes.
- **De-duplication**: Submitting the same URL and category within 24 hours returns the existing record rather than inflating the database.
- **Privacy Preservation**: Voter identities are recorded strictly as one-way SHA-256 hashes of the client IP address. Raw IPs are never stored in vote tables.
- **Domain Canonicalization**: Domains are stripped of protocol, ports, query strings, `www.`, and trailing periods before lookup to guarantee consistent cache hits.

---

## ⚖️ Scoring Formula & Tuning

All module weights and verdict boundaries are defined in [`backend/app/config.py`](backend/app/config.py):

$$\text{Trust Score} = \sum (\text{Module Score}_i \times \text{Weight}_i)$$

* Default Weights:
  - **AI URL Predictor**: `0.30`
  - **SSL Certificate**: `0.25`
  - **Web Security Headers**: `0.20`
  - **Threat Intelligence**: `0.25`
* Verdict Thresholds:
  - **Safe**: Score $\ge 80$
  - **Suspicious**: $50 \le \text{Score} < 80$
  - **Dangerous**: $\text{Score} < 50$

---

## 👥 Authors & HackMatrix '26

Built for **HackMatrix '26** — *Autonomous Agentic & Digital Trust Intelligence Track*.
- Project Repository: [https://github.com/profharshit/HackMatrix26](https://github.com/profharshit/HackMatrix26)
