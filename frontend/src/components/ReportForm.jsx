import React, { useState } from 'react';
import Reveal from './Reveal';
import VideoIcon from './VideoIcon';
import { submitThreatReport } from '../services/api';

const CATEGORIES = ['Phishing', 'Fake Recruitment', 'Credential Harvesting', 'Malware', 'Certificate Anomaly', 'Other'];

export default function ReportForm() {
  const [f, setF] = useState({ url: '', category: CATEGORIES[0], targetBrand: '', comment: '' });
  const [state, setState] = useState({ busy: false, msg: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, msg: '' });
    try {
      const res = await submitThreatReport(f);
      setState({ busy: false, msg: res.message || 'Report submitted. Thank you.' });
      setF({ url: '', category: CATEGORIES[0], targetBrand: '', comment: '' });
    } catch {
      setState({ busy: false, msg: 'Could not submit the report. Please try again.' });
    }
  };

  const input = 'w-full rounded-2xl border border-[#22396F] bg-[#111215] px-5 py-3.5 outline-none text-bone placeholder:text-slate-muted focus:border-accent transition-colors';

  return (
    <section id="report" className="border-t border-[#22396F] bg-[#0D1C42]/50 py-28 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-2">
        <Reveal>
          <div className="flex items-center gap-3">
            <VideoIcon src="/icons/3333.mp4" size="sm" />
            <span className="eyebrow">Community intelligence</span>
          </div>
          <h2 className="h-display mt-5 text-[clamp(2.2rem,5vw,4.2rem)] text-bone">Seen something suspicious?</h2>
          <p className="mt-6 max-w-md text-lg text-slate">
            Reports from people like you feed directly into the threat intel score, protecting the next person who scans the same link.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <form onSubmit={submit} className="space-y-4">
            <input required className={input} placeholder="Suspicious URL" value={f.url} onChange={set('url')} aria-label="Suspicious URL" />
            <div className="grid gap-4 sm:grid-cols-2">
              <select className={input} value={f.category} onChange={set('category')} aria-label="Category">
                {CATEGORIES.map((c) => <option key={c} className="bg-[#111215] text-bone">{c}</option>)}
              </select>
              <input className={input} placeholder="Impersonated brand (optional)" value={f.targetBrand} onChange={set('targetBrand')} aria-label="Impersonated brand" />
            </div>
            <textarea required rows={4} className={input} placeholder="What made it suspicious?" value={f.comment} onChange={set('comment')} aria-label="Comment" />
            <div className="flex items-center gap-4">
              <button className="btn-primary px-7 py-3 text-base" disabled={state.busy}>{state.busy ? 'Submitting…' : 'Submit report'}</button>
              {state.msg && <p role="status" className="text-sm text-slate">{state.msg}</p>}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
