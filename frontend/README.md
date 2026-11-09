# ThreatWho AI — Frontend Application

Modern cyber-intelligence user interface for the ThreatWho Web Threat Detection & Digital Trust Intelligence platform, built for **HackMatrix '26**.

## 🎨 Design System & Visual Architecture

- **Color Palette**:
  - Ink Backgrounds: `#17181c` (base), `#111215` (deep cards)
  - Sapphire Navy: `#0D1C42` (ambient panels), `#22396F` (borders & accents)
  - Champagne Gold: `#FCF1D0` (accent highlights, primary glow)
- **Interactive 3D Background Ecosystem**:
  - **Hero**: Vanta.js Topology (p5.js fluid wireframe waves)
  - **Three Layers**: Vanta.js Birds (Three.js 3D boid flocking simulation)
  - **Platform Modules**: Vanta.js Dots (Three.js responsive floating dot matrix)
  - **Live Scanner & CTA**: Vanta.js Net (Three.js cyber neural constellation)
  - **Edge Blending**: Soft CSS gradient masks (`maskImage`) and `backdrop-blur-[2px]` overlays eliminating all harsh horizontal lines.
- **Button System**: Uiverse `btn-17` diagonal sliding sweep with rolling text animation and automatic color inversion (`mix-blend-mode: difference`).
- **Animated Video Icons**: Streaming MP4 micro-animations (`/icons/*.mp4`) embedded in [`VideoIcon.jsx`](src/components/VideoIcon.jsx) for all core modules.
- **Offline / Demo Resilience**: Automatically detects backend health via `/health`; falls back seamlessly to a built-in simulation engine if offline.

---

## 🚀 Quick Start

```powershell
cd frontend
npm install
npm run dev
```

Open your browser at: **`http://localhost:5173`**

### Build for Production

```powershell
npm run build
```
Generates optimized static assets in `dist/`.

---

## 📁 Key Components

| Component | Description |
|:---|:---|
| [`src/components/Hero.jsx`](src/components/Hero.jsx) | Hero banner with Vanta Topology 3D canvas, headline, and live gauge |
| [`src/components/Scanner.jsx`](src/components/Scanner.jsx) | URL input, 0–100 SVG trust gauge, 4-module forensic breakdown, and domain intel lookup |
| [`src/components/Sections.jsx`](src/components/Sections.jsx) | Layers, Numbers, Platform tabs, Comparison matrix, FAQ, CTA, and Footer |
| [`src/components/ReportForm.jsx`](src/components/ReportForm.jsx) | Crowdsourced threat submission form |
| [`src/components/Button.jsx`](src/components/Button.jsx) | Reusable Uiverse `btn-17` diagonal sweep button |
| [`src/components/VideoIcon.jsx`](src/components/VideoIcon.jsx) | Reusable streaming MP4 animated icon player with Lucide fallback |
| [`src/components/TopologyBackground.jsx`](src/components/TopologyBackground.jsx) | Vanta Topology (p5.js) wrapper |
| [`src/components/BirdsBackground.jsx`](src/components/BirdsBackground.jsx) | Vanta Birds (Three.js) wrapper |
| [`src/components/DotsBackground.jsx`](src/components/DotsBackground.jsx) | Vanta Dots (Three.js) wrapper |
| [`src/components/NetBackground.jsx`](src/components/NetBackground.jsx) | Vanta Net (Three.js) wrapper |
| [`src/services/api.js`](src/services/api.js) | Dual-mode API client (live gateway + offline fallback engine) |
