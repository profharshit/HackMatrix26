import React from 'react';
import { ArrowRight } from 'lucide-react';
import VideoIcon from './VideoIcon';
import Button from './Button';
import TopologyBackground from './TopologyBackground';

function Ring({ value, size = 150, stroke = 12 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#22396F" strokeWidth={stroke} fill="none" opacity="0.6" />
      <circle
        cx={size / 2} cy={size / 2} r={r} stroke="#FCF1D0" strokeWidth={stroke} fill="none"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)}
      />
    </svg>
  );
}

const ROWS = [
  ['AI model', 96, '/icons/gear-wrench.mp4'],
  ['Certificate', 92, '/icons/key.mp4'],
  ['Web security', 88, '/icons/security.mp4'],
  ['Threat intel', 100, '/icons/global-education.mp4'],
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <TopologyBackground
        color={0xefefef}
        backgroundColor={0x232e81}
        className="pt-36 md:pt-44 pb-20"
      >
        {/* Soft dark vignettes to preserve contrast and smoothly transition into page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#17181c]/60 via-transparent to-[#17181c] z-[1]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-10 left-1/2 h-[280px] w-[500px] -translate-x-1/2 rounded-full bg-accent/10 blur-[100px] z-[1]"
        />

        <div className="container-x relative z-10">
        <p className="eyebrow mb-6">Digital trust intelligence</p>
        <h1 className="h-display max-w-5xl text-[clamp(2.9rem,8.5vw,7.5rem)] text-bone">
          The trust operating system for the web.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate md:text-xl">
          ThreatWho is the intelligence layer for every link you click. It scans a URL passively and
          turns four independent checks into one explainable Digital Trust Score, in seconds.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="#scanner" variant="primary">
            Scan a URL <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="#platform" variant="ghost">
            Explore the platform
          </Button>
        </div>

        <div className="card relative mt-16 overflow-hidden p-5 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)] border-[#22396F] bg-ink-800 md:mt-24 md:p-8">
          <div className="mb-6 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#22396F]" />
            <span className="h-3 w-3 rounded-full bg-[#22396F]" />
            <span className="h-3 w-3 rounded-full bg-[#22396F]" />
            <span className="ml-3 truncate font-mono text-xs text-slate-muted">https://github.com/login</span>
          </div>
          <div className="grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-14">
            <div className="relative mx-auto">
              <Ring value={94} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold tracking-tight text-bone">94</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-semibold">Safe</span>
              </div>
            </div>
            <div className="space-y-4">
              {ROWS.map(([label, v, video]) => (
                <div key={label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-bone/90 font-medium">
                      <VideoIcon src={video} size="xs" />
                      {label}
                    </span>
                    <span className="font-mono text-slate">{v}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#111215]">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TopologyBackground>
  </section>
);
}
