import React, { useState } from 'react';
import {
  Search,
  Shield,
  KeyRound,
  FileCode2,
  Users,
  AlertCircle,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  FileText,
  AlertTriangle,
  Globe2,
  Cpu,
  Lock,
  Layers
} from 'lucide-react';
import TrustScoreGauge from '../components/TrustScoreGauge';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import AuditReportModal from '../components/AuditReportModal';
import { PRESET_TARGETS } from '../services/mockData';
import { scanUrl, saveScanToHistory } from '../services/api';

export default function ScannerView({
  onOpenDetail,
  activeScan,
  setActiveScan,
  onOpenReportModal,
  onNavigateTab
}) {
  const [inputUrl, setInputUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [isAuditReportOpen, setIsAuditReportOpen] = useState(false);

  const runScan = async (target) => {
    const urlToScan = target || inputUrl;
    if (!urlToScan.trim()) return;

    setIsScanning(true);
    setScanStep(1);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 250);

    try {
      const result = await scanUrl(urlToScan);
      clearInterval(stepInterval);
      setActiveScan(result);
      saveScanToHistory(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
      setScanStep(0);
    }
  };

  const handlePresetSelect = (preset) => {
    setInputUrl(preset.url);
    runScan(preset.url);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 font-sans">
      {/* 1. EDITORIAL HERO SECTION (mijonju.com inspired) */}
      <section className="relative pt-2">
        {/* Top Tag & Decorative glyphs */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffedd5] border border-navy-900 rounded font-mono text-[11px] font-bold text-navy-900 shadow-brutal-sm">
            <span>🛡️ DIGITAL TRUST INTELLIGENCE</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-lg select-none text-navy-900 font-mono">
            <span title="Cryptographic Key">🔑</span>
            <span title="Trust Shield">🛡️</span>
            <span title="Network Node">🌐</span>
            <span title="Security Radar">📡</span>
          </div>
        </div>

        {/* Big Bold Headline */}
        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy-900 uppercase leading-[1.08] max-w-5xl">
          AI-POWERED WEB THREAT DETECTION, PHISHING RADAR, CERTIFICATE VALIDATION, AND DIGITAL TRUST INTELLIGENCE.
        </h1>

        <p className="mt-3 font-mono text-xs sm:text-sm text-grey-600 max-w-3xl">
          + passive reconnaissance &nbsp;•&nbsp; cryptographic verification &nbsp;•&nbsp; eMudhra CA audit &nbsp;•&nbsp; community defense
        </p>

        {/* URL Scanner Search Box - Editorial Neo-Brutal Form */}
        <div className="mt-8 bg-white border-2 border-navy-900 p-4 sm:p-5 rounded-lg shadow-brutal">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runScan();
            }}
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-900 font-mono font-bold text-xs">
                TARGET:
              </div>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example.com/login or target URL"
                className="w-full pl-20 pr-4 py-3 bg-[#faf9f6] border border-navy-900 rounded font-mono text-xs text-navy-900 placeholder-grey-400 focus:outline-none focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isScanning || !inputUrl.trim()}
              className="px-6 py-3 bg-navy-900 text-white rounded font-mono font-bold text-xs hover:bg-navy-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 flex-shrink-0"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AUDITING TARGET...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>ANALYZE TRUST SCORE →</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Problem Statement Presets */}
          <div className="mt-4 pt-3 border-t border-navy-900/15 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
            <span className="font-mono text-[10px] uppercase font-bold text-grey-500 whitespace-nowrap">
              Test Scenarios:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_TARGETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`px-2.5 py-1 rounded font-mono text-[11px] font-semibold border border-navy-900 transition-all hover:shadow-brutal-sm ${
                    preset.verdict === 'dangerous'
                      ? 'bg-[#fee2e2] text-red-950'
                      : preset.verdict === 'suspicious'
                        ? 'bg-[#fef3c7] text-amber-950'
                        : 'bg-[#dcfce7] text-emerald-950'
                  }`}
                >
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME MULTI-STAGE RECON PROGRESSION */}
      {isScanning && (
        <section className="bg-white border-2 border-navy-900 rounded-lg p-5 shadow-brutal space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold uppercase text-navy-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Executing 4-Pillar Passive Evaluation Protocol (5s Budget)...
            </span>
            <span className="text-grey-500">PHASE {scanStep} / 4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: 'T - THREAT AI MODEL', desc: 'Syntactic token entropy & brand spoofing rules' },
              { title: 'R - ROOT CA INTEGRITY', desc: 'PKI chains, CT logs & eMudhra key generator' },
              { title: 'U - UPTIME & POSTURE', desc: 'Defensive headers, cookie attributes & CORS' },
              { title: 'S - SIGNALS FEED', desc: 'PhishTank, OpenPhish & crowdsourced voting' },
            ].map((step, i) => (
              <div
                key={i}
                className={`p-3 rounded border font-mono text-xs transition-colors ${
                  scanStep > i
                    ? 'border-navy-900 bg-[#dcfce7] text-emerald-950'
                    : scanStep === i + 1
                      ? 'border-navy-900 bg-[#fef3c7] text-navy-900 font-bold shadow-brutal-sm'
                      : 'border-grey-300 bg-[#faf9f6] text-grey-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span>{step.title}</span>
                  {scanStep > i && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <p className="text-[10px] text-grey-600 font-sans leading-tight">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. ACTIVE SCAN EVALUATION RESULTS */}
      {activeScan && !isScanning && (
        <section className="space-y-6">
          {/* Target Metadata Bar */}
          <div className="bg-white border border-navy-900 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-brutal-sm">
            <div className="flex items-center gap-3 truncate">
              <div className="w-8 h-8 rounded bg-[#faf9f6] border border-navy-900 flex items-center justify-center font-bold font-mono text-xs">
                URL
              </div>
              <div className="truncate">
                <span className="text-[10px] font-mono text-grey-500 uppercase block">Audited Endpoint Target</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-navy-900 truncate block">
                  {activeScan.url}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono flex-shrink-0 self-end md:self-center">
              <button
                onClick={() => setIsAuditReportOpen(true)}
                className="px-3 py-1.5 bg-navy-900 text-white rounded font-bold text-[11px] hover:bg-navy-800 transition-colors shadow-brutal-sm flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>EXPORT PDF AUDIT</span>
              </button>

              <div className="px-2.5 py-1 bg-[#faf9f6] border border-navy-900 rounded text-grey-700 text-[11px]">
                ID: {activeScan.id}
              </div>
            </div>
          </div>

          {/* Core Trust Score Gauge Card */}
          <TrustScoreGauge
            score={activeScan.trust_score}
            verdict={activeScan.verdict}
            confidence={activeScan.breakdown?.model?.confidence || 0.92}
          />

          {/* Plain-English Decision Rationale */}
          <div className="bg-white border border-navy-900 rounded-lg p-5 sm:p-6 shadow-brutal-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs font-bold uppercase bg-[#ffedd5] border border-navy-900 px-2 py-0.5 rounded">
                EXPLAINABLE AI REASONS
              </span>
              <span className="text-xs font-mono text-grey-500">
                Decision Rationale (Plain English)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeScan.reasons && activeScan.reasons.length > 0 ? (
                activeScan.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded bg-[#faf9f6] border border-navy-900/20 text-xs text-navy-900 font-sans"
                  >
                    <span className="w-2 h-2 rounded-full bg-navy-900 mt-1 flex-shrink-0" />
                    <span className="leading-relaxed">{reason}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-grey-500 font-mono">No threat vectors identified. Target verified safe.</div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. THE ICONIC 5-COLUMN EDITORIAL STRIP: T - R - U - S - T (Inspired by mijonju.com T-A-P-E-R banner) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-navy-900" />
            <h2 className="font-display font-bold text-lg text-navy-900 uppercase tracking-tight">
              THE FIVE PILLARS OF DIGITAL TRUST // CORE RADAR
            </h2>
          </div>
          <span className="font-mono text-[11px] text-grey-500 hidden sm:inline">
            CLICK ANY PILLAR FOR DEEP FORENSICS →
          </span>
        </div>

        {/* 5 Vertical Colored Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-2 border-navy-900 rounded-lg overflow-hidden shadow-brutal">
          {/* T - THREAT */}
          <div
            onClick={() => onOpenDetail('model')}
            className="p-5 bg-[#fbcfe8] border-b lg:border-b-0 lg:border-r border-navy-900 flex flex-col justify-between min-h-[220px] cursor-pointer hover:bg-[#f472b6] transition-colors group"
          >
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display font-black text-4xl text-navy-900">T</span>
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-navy-900">THREAT</span>
              </div>
              <p className="font-mono text-[11px] text-navy-950 font-bold mb-1">
                REAL-TIME THREAT DETECTION
              </p>
              <p className="text-xs text-navy-900/90 leading-snug">
                Phishing heuristics, lexical entropy & brand spoofing classifier.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between text-navy-900 font-mono text-xs font-bold">
              <span>{activeScan?.breakdown?.model?.score ? `SCORE: ${activeScan.breakdown.model.score}/100` : 'INSPECT'}</span>
              <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* R - ROOT CA */}
          <div
            onClick={() => {
              if (onNavigateTab) onNavigateTab('certificate');
              else onOpenDetail('certificate');
            }}
            className="p-5 bg-[#fef08a] border-b lg:border-b-0 lg:border-r border-navy-900 flex flex-col justify-between min-h-[220px] cursor-pointer hover:bg-[#fde047] transition-colors group"
          >
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display font-black text-4xl text-navy-900">R</span>
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-navy-900">ROOT CA</span>
              </div>
              <p className="font-mono text-[11px] text-navy-950 font-bold mb-1">
                CRYPTOGRAPHIC CA AUDITING
              </p>
              <p className="text-xs text-navy-900/90 leading-snug">
                PKI trust chain auditing, CT logs & eMudhra incident defense.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between text-navy-900 font-mono text-xs font-bold">
              <span>{activeScan?.breakdown?.certificate?.score ? `SCORE: ${activeScan.breakdown.certificate.score}/100` : 'INSPECT'}</span>
              <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* U - UPTIME & POSTURE */}
          <div
            onClick={() => {
              if (onNavigateTab) onNavigateTab('security');
              else onOpenDetail('security');
            }}
            className="p-5 bg-[#fed7aa] border-b sm:border-b-0 lg:border-r border-navy-900 flex flex-col justify-between min-h-[220px] cursor-pointer hover:bg-[#fdba74] transition-colors group"
          >
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display font-black text-4xl text-navy-900">U</span>
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-navy-900">UPTIME</span>
              </div>
              <p className="font-mono text-[11px] text-navy-950 font-bold mb-1">
                DEFENSIVE POSTURE INSPECTION
              </p>
              <p className="text-xs text-navy-900/90 leading-snug">
                HSTS enforcement, CSP clickjacking defense & cookie security.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between text-navy-900 font-mono text-xs font-bold">
              <span>{activeScan?.breakdown?.web_security?.score ? `SCORE: ${activeScan.breakdown.web_security.score}/100` : 'INSPECT'}</span>
              <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* S - SIGNALS */}
          <div
            onClick={() => {
              if (onNavigateTab) onNavigateTab('intel');
              else onOpenDetail('intel');
            }}
            className="p-5 bg-[#bae6fd] border-b sm:border-b-0 lg:border-r border-navy-900 flex flex-col justify-between min-h-[220px] cursor-pointer hover:bg-[#7dd3fc] transition-colors group"
          >
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display font-black text-4xl text-navy-900">S</span>
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-navy-900">SIGNALS</span>
              </div>
              <p className="font-mono text-[11px] text-navy-950 font-bold mb-1">
                COLLABORATIVE INTELLIGENCE
              </p>
              <p className="text-xs text-navy-900/90 leading-snug">
                Crowdsourced reports, blocklist cross-checks & consensus votes.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between text-navy-900 font-mono text-xs font-bold">
              <span>{activeScan?.breakdown?.threat_intel?.score ? `SCORE: ${activeScan.breakdown.threat_intel.score}/100` : 'INSPECT'}</span>
              <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* T - TELEMETRY */}
          <div
            onClick={() => {
              if (onNavigateTab) onNavigateTab('domain');
            }}
            className="p-5 bg-[#e2e8f0] flex flex-col justify-between min-h-[220px] cursor-pointer hover:bg-[#cbd5e1] transition-colors group"
          >
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display font-black text-4xl text-navy-900">T</span>
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-navy-900">TELEMETRY</span>
              </div>
              <p className="font-mono text-[11px] text-navy-950 font-bold mb-1">
                DOMAIN & NETWORK RECON
              </p>
              <p className="text-xs text-navy-900/90 leading-snug">
                ICANN registrar WHOIS, IP geolocation & autonomous system.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between text-navy-900 font-mono text-xs font-bold">
              <span>LOOKUP</span>
              <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. POST-IT STICKER NOTE & MANIFESTO SECTION (Inspired by Image 1 bottom) */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-4">
        {/* Left: Taped Post-it Sticker Note */}
        <div className="md:col-span-5">
          <div className="masking-tape bg-[#fefce8] border border-navy-900/30 p-5 rounded font-mono text-xs shadow-brutal-sm rotate-[-1deg] max-w-sm">
            <span className="text-[10px] text-grey-500 uppercase block mb-2 font-bold">
              // AUDIT PROTOCOL RULES
            </span>
            <ul className="space-y-1.5 text-navy-900">
              <li className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border border-navy-900 flex items-center justify-center text-[10px] bg-white font-bold">✓</span>
                <span>Passive checks only (no port scan)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border border-navy-900 flex items-center justify-center text-[10px] bg-white font-bold">✓</span>
                <span>5-second timeout per module</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border border-navy-900 flex items-center justify-center text-[10px] bg-white font-bold">✓</span>
                <span>eMudhra key entropy checker</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border border-navy-900 flex items-center justify-center text-[10px] bg-white font-bold">✓</span>
                <span>Guest mode active (no login gate)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Security Manifesto & Circular Cyber Seal */}
        <div className="md:col-span-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-md">
            <p className="font-mono text-xs text-navy-900 leading-relaxed">
              This is not just a scanner. It is a digital trust platform built to expose vulnerabilities in web infrastructure and cryptographic trust.
            </p>
            <p className="font-mono text-[11px] text-grey-600">
              "Building transparency in web trust: because cryptographic integrity cannot be taken for granted."
            </p>
            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab('certificate');
              }}
              className="inline-flex items-center gap-1 font-mono text-xs font-bold text-navy-900 underline hover:text-navy-700"
            >
              <span>READ THE EMUDHRA ADVISORY</span>
              <span>→</span>
            </button>
          </div>

          {/* Circular Cyber Stamp */}
          <div className="stamp-seal w-24 h-24 p-2 flex-shrink-0 font-mono select-none">
            <span className="text-[8px] tracking-widest uppercase text-grey-500">PUBLIC TRUST</span>
            <span className="text-xs font-bold text-navy-900">VERIFIED</span>
            <span className="text-[8px] text-grey-500">PASSIVE</span>
          </div>
        </div>
      </section>

      {/* Printable Audit Report Modal */}
      <AuditReportModal
        isOpen={isAuditReportOpen}
        onClose={() => setIsAuditReportOpen(false)}
        scanData={activeScan}
      />
    </div>
  );
}
