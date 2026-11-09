import React from 'react';

const ITEMS = ['PhishTank', 'OpenPhish', 'URLhaus', 'Google Safe Browsing', 'Certificate Transparency', 'OCSP', 'WHOIS', 'ScamAdviser', 'TLS 1.3', 'HSTS', 'CSP'];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section className="mt-20 border-y border-[#22396F] py-8 bg-[#111215]/50" aria-label="Signals ThreatWho reads">
      <p className="mb-5 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-slate-muted">
        Signals we read, passively
      </p>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-14 whitespace-nowrap">
          {row.map((t, i) => (
            <span key={i} className="text-2xl font-semibold tracking-tight text-slate-muted/40 transition-colors hover:text-accent">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
