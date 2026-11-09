import React, { useState } from 'react';
import { Search, Loader2, History, Globe } from 'lucide-react';
import Reveal from './Reveal';
import VideoIcon from './VideoIcon';
import { scanUrl, getDomainIntel, saveScanToHistory, getSavedScanHistory, clearScanHistory } from '../services/api';
import { PRESET_TARGETS } from '../services/mockData';

const VERDICT = {
  safe: { color: '#FCF1D0', label: 'Safe' },           // Champagne Cream
  suspicious: { color: '#FFD166', label: 'Suspicious' }, // Warm Amber Gold
  dangerous: { color: '#FF6B6B', label: 'Dangerous' },   // Coral Red
};

const MODULES = [
  ['model', 'AI model', '/icons/gear-wrench.mp4'],
  ['certificate', 'Certificate', '/icons/key.mp4'],
  ['web_security', 'Web security', '/icons/security.mp4'],
  ['threat_intel', 'Threat intel', '/icons/global-education.mp4'],
];

function Gauge({ value, color }) {
  const size = 180, stroke = 14, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#22396F" strokeWidth={stroke} fill="none" opacity="0.6" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-bold tracking-tight text-bone">{value}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-muted">Trust score</span>
      </div>
    </div>
  );
}

function ScanResult({ scan }) {
  const v = VERDICT[scan.verdict] || VERDICT.suspicious;
  const bd = scan.breakdown || {};
  return (
    <div className="card mt-8 p-6 md:p-10 border border-[#22396F] bg-ink-800">
      <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
        <div className="mx-auto"><Gauge value={scan.trust_score ?? 0} color={v.color} /></div>
        <div>
          <span className="inline-block rounded-full px-3 py-1 font-mono text-xs uppercase tracking-widest font-bold" style={{ background: `${v.color}22`, color: v.color }}>
            {v.label}
          </span>
          <p className="mt-4 break-all font-mono text-sm text-slate">{scan.url}</p>
          <ul className="mt-6 space-y-2.5">
            {(scan.reasons || []).map((r, i) => (
              <li key={i} className="flex gap-3 text-bone/90">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: v.color }} />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map(([key, label, video]) => {
          const m = bd[key];
          const s = m?.score;
          const issues = m?.issues || (key === 'threat_intel' ? m?.feeds_hit : []) || [];
          return (
            <div key={key} className="rounded-2xl border border-[#22396F]/70 bg-ink-950 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <VideoIcon src={video} size="xs" />
                    <span className="text-sm font-medium text-slate">{label}</span>
                  </div>
                  <span className="font-mono text-lg text-bone font-semibold">{s ?? '—'}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#0D1C42]">
                  <div className="h-full rounded-full" style={{ width: `${s ?? 0}%`, background: v.color }} />
                </div>
              </div>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-muted">
                {s == null ? <li>Check skipped or timed out</li> : issues.slice(0, 3).map((x, i) => <li key={i}>• {x}</li>)}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Scanner({ online }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [scan, setScan] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(getSavedScanHistory());

  const [domain, setDomain] = useState('');
  const [intel, setIntel] = useState(null);
  const [intelLoading, setIntelLoading] = useState(false);

  const run = async (target) => {
    const t = (target ?? url).trim();
    if (!t) return;
    setUrl(t);
    setLoading(true);
    setError('');
    try {
      const result = await scanUrl(t);
      setScan(result);
      saveScanToHistory(result);
      setHistory(getSavedScanHistory());
    } catch (e) {
      setError('Scan failed. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const lookup = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setIntelLoading(true);
    try { setIntel(await getDomainIntel(domain.trim())); } catch { setIntel(null); }
    setIntelLoading(false);
  };

  return (
    <section id="scanner" className="border-t border-[#22396F] py-28 md:py-36">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Live scanner</p>
          <h2 className="h-display mt-5 max-w-4xl text-[clamp(2.2rem,6vw,5rem)] text-bone">See what a link is hiding.</h2>
          <p className="mt-6 max-w-2xl text-lg text-slate">
            {online ? 'Connected to the ThreatWho API.' : 'Backend not detected, so scans use the built-in demo engine.'}
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <form onSubmit={(e) => { e.preventDefault(); run(); }} className="flex flex-col gap-3 rounded-[1.75rem] border border-[#22396F] bg-ink-800 p-3 sm:flex-row focus-within:border-accent transition-colors">
            <div className="flex flex-1 items-center gap-3 px-4">
              <Search className="h-5 w-5 shrink-0 text-slate-muted" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a URL, e.g. https://example.com/login"
                aria-label="URL to scan"
                className="w-full bg-transparent py-3 text-lg outline-none text-bone placeholder:text-slate-muted"
              />
            </div>
            <button type="submit" disabled={loading || !url.trim()} className="btn-primary px-8 py-3.5 text-base disabled:opacity-40">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Scanning</> : 'Scan'}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="self-center font-mono text-[11px] uppercase tracking-widest text-slate-muted">Try:</span>
            {PRESET_TARGETS.map((p) => (
              <button key={p.url} onClick={() => run(p.url)} disabled={loading}
                className="rounded-full border border-[#22396F] bg-[#111215]/60 px-4 py-1.5 text-sm text-slate transition-colors hover:border-accent hover:text-accent disabled:opacity-40">
                {p.name.split('(')[0].trim()}
              </button>
            ))}
          </div>
          {error && <p role="alert" className="mt-4 text-danger">{error}</p>}
        </Reveal>

        {scan && <ScanResult scan={scan} />}

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          <Reveal className="card p-7 md:p-9 border-[#22396F] bg-ink-800">
            <div className="flex items-center gap-2 text-slate"><Globe className="h-5 w-5 text-accent" /> <h3 className="text-xl font-semibold tracking-tight text-bone">Domain intel</h3></div>
            <form onSubmit={lookup} className="mt-6 flex gap-2">
              <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" aria-label="Domain"
                className="min-w-0 flex-1 rounded-full border border-[#22396F] bg-ink-950 px-5 py-3 outline-none focus:border-accent text-bone placeholder:text-slate-muted" />
              <button className="btn-primary" disabled={intelLoading}>{intelLoading ? '…' : 'Look up'}</button>
            </form>
            {intel && (
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                {[
                  ['Domain', intel.domain], ['Trust score', intel.trust_score], ['Verdict', intel.verdict],
                  ['Reports', intel.reports], ['Feeds hit', (intel.feeds_hit || []).length],
                  ['Cert issuer', intel.certificate_issuer],
                ].map(([k, val]) => (
                  <div key={k} className="rounded-xl border border-[#22396F]/70 bg-ink-950 p-3">
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-slate-muted">{k}</dt>
                    <dd className="mt-1 break-words text-bone font-medium">{String(val ?? '—')}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>

          <Reveal delay={100} className="card p-7 md:p-9 border-[#22396F] bg-ink-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><History className="h-5 w-5 text-accent" /> <h3 className="text-xl font-semibold tracking-tight text-bone">Recent scans</h3></div>
              {history.length > 0 && (
                <button onClick={() => { clearScanHistory(); setHistory([]); }} className="text-xs text-slate-muted hover:text-accent transition-colors">Clear</button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="mt-6 text-sm text-slate-muted">Your scans will appear here.</p>
            ) : (
              <ul className="mt-6 divide-y divide-[#22396F]">
                {history.slice(0, 6).map((h) => (
                  <li key={h.id}>
                    <button onClick={() => { setScan(h); setUrl(h.url); }} className="flex w-full items-center justify-between gap-4 py-3 text-left hover:text-accent transition-colors">
                      <span className="truncate font-mono text-sm text-slate">{h.url}</span>
                      <span className="shrink-0 font-mono text-sm font-semibold" style={{ color: (VERDICT[h.verdict] || VERDICT.suspicious).color }}>{h.trust_score}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
