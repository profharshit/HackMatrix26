import React, { useEffect, useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import VideoIcon from './VideoIcon';

const LINKS = [
  { href: '#platform', label: 'Platform' },
  { href: '#how', label: 'How it works' },
  { href: '#scanner', label: 'Scanner' },
  { href: '#security', label: 'Security' },
  { href: '#faq', label: 'FAQ' },
];

export default function Nav({ online }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'bg-[#17181c]/90 backdrop-blur-xl border-b border-[#22396F]' : 'border-b border-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-bone group">
          <VideoIcon src="/icons/security.mp4" size="xs" fallback={ShieldCheck} className="group-hover:scale-105 transition-transform" />
          <span>ThreatWho</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-slate md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-accent">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span
            className="flex items-center gap-2 rounded-full border border-[#22396F] bg-[#0D1C42] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-slate-muted"
            title={online ? 'Backend connected' : 'Backend offline — demo engine active'}
          >
            <span className={`h-2 w-2 rounded-full ${online ? 'bg-accent shadow-[0_0_8px_rgba(252,241,208,0.8)]' : 'bg-warn'}`} />
            {online ? 'API live' : 'Demo mode'}
          </span>
          <a href="#report" className="btn-ghost">Report a threat</a>
          <a href="#scanner" className="btn-primary">Free scan</a>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-bone hover:text-accent transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="container-x flex flex-col gap-1 pb-6 md:hidden bg-[#17181c] border-b border-[#22396F]">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-2xl font-semibold tracking-tight text-bone hover:text-accent">
              {l.label}
            </a>
          ))}
          <div className="mt-4 flex gap-3">
            <a href="#scanner" onClick={() => setOpen(false)} className="btn-primary flex-1">Free scan</a>
            <a href="#report" onClick={() => setOpen(false)} className="btn-ghost flex-1">Report</a>
          </div>
        </div>
      )}
    </header>
  );
}
