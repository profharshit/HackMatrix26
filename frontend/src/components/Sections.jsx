import React, { useState } from 'react';
import { Brain, Lock, ShieldAlert, Radar, Megaphone, Plus, Minus, ArrowRight, Check } from 'lucide-react';
import Reveal from './Reveal';

/* ---------- Three layers ---------- */
const LAYERS = [
  {
    tag: 'Intelligence layer',
    title: 'One view of every signal behind a link.',
    body: 'ThreatWho ingests URL structure, TLS certificates, HTTP security headers and community threat feeds, then turns them into a single score with plain-English reasons from the first scan.',
  },
  {
    tag: 'Automation layer',
    title: 'Four checks, running in parallel.',
    body: 'Every scan fans out to the AI model, certificate, web security and threat intel modules at the same time. A slow or failed check is skipped, never allowed to break the scan.',
  },
  {
    tag: 'Trust layer',
    title: 'A score you can explain to anyone.',
    body: 'Scores are combined with tunable weights into a 0–100 Digital Trust Score and a verdict: safe, suspicious or dangerous. Every point deducted comes with a reason.',
  },
];

export function Layers() {
  return (
    <section className="container-x py-28 md:py-40">
      <Reveal>
        <h2 className="h-display max-w-4xl text-[clamp(2.2rem,6vw,5rem)] text-bone">
          Web trust needed <span className="text-accent">a brain.</span> We built it.
        </h2>
      </Reveal>
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {LAYERS.map((l, i) => (
          <Reveal key={l.tag} delay={i * 100} className="card flex flex-col p-8 md:p-9 border-[#22396F] bg-ink-800 hover:border-accent transition-all">
            <span className="eyebrow">{l.tag}</span>
            <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-tight text-bone">{l.title}</h3>
            <p className="mt-4 leading-relaxed text-slate">{l.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Numbers ---------- */
const STATS = [
  ['4', 'independent checks per scan'],
  ['0–100', 'explainable trust score'],
  ['5 s', 'time limit per check'],
  ['0', 'ports scanned. Passive only'],
];

export function Numbers() {
  return (
    <section className="border-y border-[#22396F] bg-[#0D1C42]/60">
      <div className="container-x grid grid-cols-2 gap-y-10 py-16 md:grid-cols-4">
        {STATS.map(([n, l], i) => (
          <Reveal key={l} delay={i * 80}>
            <div className="text-5xl font-semibold tracking-tight md:text-6xl text-bone">{n}</div>
            <div className="mt-2 max-w-[14rem] text-sm text-slate-muted">{l}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Platform tabs ---------- */
const MODULES = [
  {
    id: 'model', icon: Brain, name: 'Detect',
    title: 'AI that reads the URL itself.',
    body: 'A model scores lexical features such as length, subdomain depth, keywords, entropy and IP hosts to spot phishing and brand impersonation before a page even loads.',
    bars: [['Brand impersonation', 12], ['Subdomain depth', 30], ['URL entropy', 22]],
  },
  {
    id: 'cert', icon: Lock, name: 'Certificates',
    title: 'Check the chain, not just the padlock.',
    body: 'Validates issuer, expiry, key strength, SAN coverage and Certificate Transparency presence, so weak keys and untrusted CAs surface immediately.',
    bars: [['Chain valid to root', 100], ['CT log presence', 90], ['Key strength', 85]],
  },
  {
    id: 'web', icon: ShieldAlert, name: 'Web security',
    title: 'Headers that tell the truth.',
    body: 'Inspects HSTS, CSP, X-Frame-Options, cookie flags and redirect behaviour. Missing protections turn into specific, fixable findings.',
    bars: [['HSTS', 100], ['Content-Security-Policy', 60], ['Cookie flags', 75]],
  },
  {
    id: 'intel', icon: Radar, name: 'Threat intel',
    title: 'Every feed, one verdict.',
    body: 'Cross-references domain age, registrar and known blocklists, then folds in community reports so new campaigns are caught as they emerge.',
    bars: [['Feed hits', 100], ['Domain age', 80], ['Community trust', 90]],
  },
  {
    id: 'report', icon: Megaphone, name: 'Report',
    title: 'Crowd-sourced defence.',
    body: 'Spotted something dodgy? Report it. Community reports and votes feed straight back into the threat intel score for the next person who scans it.',
    bars: [['Reports submitted', 70], ['Verified', 45], ['Upvotes', 85]],
  },
];

export function Platform() {
  const [active, setActive] = useState(0);
  const m = MODULES[active];
  const Icon = m.icon;
  return (
    <section id="platform" className="container-x py-28 md:py-36">
      <Reveal>
        <p className="eyebrow">The platform</p>
        <h2 className="h-display mt-5 max-w-4xl text-[clamp(2.2rem,6vw,5rem)] text-bone">One platform for every trust decision.</h2>
        <p className="mt-6 max-w-2xl text-lg text-slate">
          Detection, certificate validation, security assessment and community intelligence, working as one system.
        </p>
      </Reveal>

      <Reveal className="mt-14">
        <div role="tablist" aria-label="Platform modules" className="flex flex-wrap gap-2">
          {MODULES.map((x, i) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                i === active
                  ? 'border-accent bg-accent text-ink-950 font-bold shadow-[0_0_20px_-3px_rgba(252,241,208,0.4)]'
                  : 'border-[#22396F] bg-[#111215]/60 text-slate hover:border-accent hover:text-white'
              }`}
            >
              {x.name}
            </button>
          ))}
        </div>

        <div className="card mt-6 grid gap-10 p-8 md:grid-cols-2 md:p-12 border-[#22396F] bg-ink-800" role="tabpanel">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <Icon className="h-9 w-9 text-accent" strokeWidth={1.6} />
              <h3 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-bone md:text-4xl">{m.title}</h3>
              <p className="mt-5 max-w-md leading-relaxed text-slate">{m.body}</p>
            </div>
            <a href="#scanner" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-white hover:gap-3 transition-all">
              Try it on a real URL <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-2xl border border-[#22396F]/70 bg-ink-950 p-6 md:p-8">
            <p className="mb-6 font-mono text-[11px] uppercase tracking-widest text-slate-muted">{m.name} · sample signals</p>
            <div className="space-y-6">
              {m.bars.map(([l, v]) => (
                <div key={l}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-bone/90">{l}</span>
                    <span className="font-mono text-slate-muted">{v}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#0D1C42]">
                    <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- How it works ---------- */
const STEPS = [
  ['Paste a URL', 'No account, no install and no agent. Guests can scan straight away.'],
  ['Four checks run at once', 'Model, certificate, web security and threat intel run in parallel with a 5-second limit each.'],
  ['Scores are weighted', 'Results merge into one trust score using weights you can tune in the backend config.'],
  ['Read the reasons', 'A verdict plus plain-English explanations, so the decision is yours and it’s informed.'],
];

export function Steps() {
  return (
    <section id="how" className="border-t border-[#22396F] bg-[#0D1C42]/40 py-28 md:py-36">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">How it works</p>
          <h2 className="h-display mt-5 max-w-3xl text-[clamp(2.2rem,6vw,5rem)] text-bone">Meaningful answers in seconds.</h2>
        </Reveal>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, b], i) => (
            <Reveal key={t} delay={i * 90} className="rounded-3xl border border-[#22396F] bg-ink-800 p-7 hover:border-accent transition-all">
              <span className="font-mono text-sm text-accent font-bold">0{i + 1}</span>
              <h3 className="mt-10 text-xl font-semibold tracking-tight text-bone">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">{b}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Before / after ---------- */
const COMPARE = [
  ['Judging a link by how it looks', 'A scored, explained verdict'],
  ['Checking five tools by hand', 'One scan, four checks'],
  ['Opaque “blocked” warnings', 'Plain-English reasons per finding'],
  ['Threats known only to the victim', 'Community reports feed the score'],
];

export function Compare() {
  return (
    <section className="container-x py-28 md:py-36">
      <Reveal>
        <h2 className="h-display max-w-4xl text-[clamp(2.2rem,6vw,5rem)] text-bone">
          Trust used to run on guesswork. Now it runs on <span className="text-accent">ThreatWho.</span>
        </h2>
      </Reveal>
      <Reveal className="mt-14 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-[#22396F] bg-ink-800 p-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-muted">Before</p>
          <ul className="mt-6 space-y-5">
            {COMPARE.map(([b]) => (
              <li key={b} className="border-b border-[#22396F]/70 pb-5 text-lg text-slate-muted last:border-0">{b}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-accent/40 bg-[#22396F]/25 p-8 shadow-[0_0_50px_-15px_rgba(252,241,208,0.15)]">
          <p className="font-mono text-[11px] uppercase tracking-widest text-accent font-bold">With ThreatWho</p>
          <ul className="mt-6 space-y-5">
            {COMPARE.map(([, a]) => (
              <li key={a} className="flex items-start gap-3 border-b border-[#22396F]/70 pb-5 text-lg text-bone last:border-0">
                <Check className="mt-1 h-5 w-5 shrink-0 text-accent" /> {a}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Security ---------- */
export function Security() {
  return (
    <section id="security" className="container-x pb-28 md:pb-36">
      <Reveal>
        <p className="eyebrow">Built for trust</p>
        <h2 className="h-display mt-5 max-w-3xl text-[clamp(2.2rem,6vw,5rem)] text-bone">Secure by design.</h2>
      </Reveal>
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        <Reveal className="card p-9 border-[#22396F] bg-ink-800 hover:border-accent transition-all">
          <h3 className="text-2xl font-semibold tracking-tight text-bone">Passive only</h3>
          <p className="mt-4 leading-relaxed text-slate">
            ThreatWho reads what any browser could see: certificates, headers and public records. It never port-scans or probes a target.
          </p>
        </Reveal>
        <Reveal delay={100} className="card p-9 border-[#22396F] bg-ink-800 hover:border-accent transition-all">
          <h3 className="text-2xl font-semibold tracking-tight text-bone">Resilient pipeline</h3>
          <p className="mt-4 leading-relaxed text-slate">
            Each module has its own time limit and fails independently. One slow feed can’t take down a scan or hide the rest of the evidence.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const FAQ = [
  ['What is ThreatWho AI?', 'A web threat detection and digital trust platform. Give it a URL and it returns a 0–100 Digital Trust Score, a verdict and the reasons behind it.'],
  ['Does it actively attack or port-scan sites?', 'No. Scans are passive: URL analysis, certificate inspection, HTTP header review and threat-feed lookups only.'],
  ['Do I need an account?', 'No. Scanning, domain lookups and threat reports are all available to guests.'],
  ['What happens if one check fails?', 'It’s skipped. Each check has a 5-second limit and a failed or slow one never crashes the scan. The score is built from what completed.'],
  ['What does the score mean?', '100 is fully trusted and 0 is very dangerous. The verdict maps to safe, suspicious or dangerous, and every deduction is listed in the reasons.'],
  ['What if the backend isn’t running?', 'The site falls back to a built-in demo engine so you can still explore the experience. The status pill in the header shows which mode you’re in.'],
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="container-x pb-28 md:pb-36">
      <Reveal>
        <h2 className="h-display text-[clamp(2.2rem,6vw,5rem)] text-bone">FAQs</h2>
      </Reveal>
      <Reveal className="mt-12 divide-y divide-[#22396F] border-y border-[#22396F]">
        {FAQ.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <div key={q}>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-xl font-medium tracking-tight text-bone hover:text-accent transition-colors md:text-2xl cursor-pointer"
              >
                {q}
                {isOpen ? <Minus className="h-5 w-5 shrink-0 text-accent" /> : <Plus className="h-5 w-5 shrink-0 text-slate-muted" />}
              </button>
              {isOpen && <p className="max-w-3xl pb-7 leading-relaxed text-slate">{a}</p>}
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}

/* ---------- CTA + Footer ---------- */
export function Cta() {
  return (
    <section className="container-x pb-24">
      <Reveal className="relative overflow-hidden rounded-[2.5rem] border border-[#22396F] bg-gradient-to-br from-[#0D1C42] via-[#162754] to-[#22396F] p-10 text-bone shadow-[0_20px_70px_-15px_rgba(1,7,54,0.95)] md:p-20">
        <div className="relative z-10">
          <p className="eyebrow mb-4">Enterprise trust</p>
          <h2 className="h-display max-w-3xl text-[clamp(2.2rem,6vw,5rem)] text-bone font-bold">Web trust, on autopilot.</h2>
          <p className="mt-6 max-w-xl text-lg text-slate font-medium">Fast to try. Nothing to install. Built for the way real people browse.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#scanner" className="btn bg-accent px-6 py-3.5 text-base text-[#17181c] font-bold hover:bg-white hover:text-[#17181c] shadow-[0_0_24px_-4px_rgba(252,241,208,0.4)] transition-all">Start a free scan</a>
            <a href="#report" className="btn border border-[#22396F] px-6 py-3.5 text-base text-bone font-semibold hover:border-accent hover:text-accent transition-all">Report a threat</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#22396F] py-14 bg-[#111215]">
      <div className="container-x flex flex-col justify-between gap-10 md:flex-row">
        <div>
          <p className="text-lg font-bold tracking-tight text-bone">ThreatWho AI</p>
          <p className="mt-3 max-w-xs text-sm text-slate-muted">AI-powered web threat detection and digital trust intelligence.</p>
        </div>
        <div className="flex gap-16 text-sm">
          <div className="space-y-3 text-slate">
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-muted">Product</p>
            <a className="block hover:text-accent transition-colors" href="#platform">Platform</a>
            <a className="block hover:text-accent transition-colors" href="#scanner">Scanner</a>
            <a className="block hover:text-accent transition-colors" href="#report">Report</a>
          </div>
          <div className="space-y-3 text-slate">
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-muted">Company</p>
            <a className="block hover:text-accent transition-colors" href="#how">How it works</a>
            <a className="block hover:text-accent transition-colors" href="#security">Security</a>
            <a className="block hover:text-accent transition-colors" href="#faq">FAQ</a>
          </div>
        </div>
      </div>
      <p className="container-x mt-12 text-xs text-slate-muted">© 2026 ThreatWho AI · HackMatrix ’26</p>
    </footer>
  );
}
