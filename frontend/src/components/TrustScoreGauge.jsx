import React from 'react';
import StatusBadge from './common/StatusBadge';

export default function TrustScoreGauge({ score = 0, verdict = 'unknown', confidence = 0.9 }) {
  const safeScore = Math.min(100, Math.max(0, score || 0));
  
  // Minimal circular stroke calculation
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  let strokeColor = '#0f172a'; // Navy default
  let verdictBg = '#faf9f6';
  if (safeScore >= 80) {
    strokeColor = '#059669'; // Emerald
    verdictBg = '#dcfce7';
  } else if (safeScore >= 40) {
    strokeColor = '#d97706'; // Amber
    verdictBg = '#fef3c7';
  } else {
    strokeColor = '#dc2626'; // Red
    verdictBg = '#fee2e2';
  }

  return (
    <div className="bg-white border-2 border-navy-900 rounded-lg p-5 sm:p-6 shadow-brutal flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        {/* SVG Circular Progress Gauge - Strictly NO Gradients */}
        <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
            {/* Background Track */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth="10"
              fill="none"
            />
            {/* Value Track - Solid color only */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={strokeColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="butt"
              fill="none"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-display font-black text-navy-900 tracking-tight leading-none">
              {safeScore}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-grey-500 mt-1">
              INDEX / 100
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
            <span className="text-[10px] font-mono font-bold text-grey-500 uppercase tracking-wide">
              SECURITY VERDICT:
            </span>
            <StatusBadge status={verdict} size="sm" />
          </div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-navy-900 tracking-tight leading-snug">
            {verdict === 'safe' && 'Website Identity & Trust Verified Legitimate'}
            {verdict === 'suspicious' && 'Anomalies Detected — Exercise Caution'}
            {verdict === 'dangerous' && 'High Threat Probability — Dangerous Endpoint'}
            {verdict !== 'safe' && verdict !== 'suspicious' && verdict !== 'dangerous' && 'Passive Evaluation Complete'}
          </h2>
          <p className="text-xs text-grey-600 mt-1 max-w-md font-sans">
            Aggregated composite score evaluating lexical patterns, SSL/TLS trust chains, HTTP security headers, and collaborative threat feeds.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto border-t md:border-t-0 md:border-l border-navy-900/20 pt-4 md:pt-0 md:pl-6 font-mono text-xs">
        <div className="flex justify-between items-center gap-4">
          <span className="text-grey-500">AI Confidence:</span>
          <span className="font-bold text-navy-900">
            {(confidence * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <span className="text-grey-500">Recon Protocol:</span>
          <span className="font-semibold text-navy-900 bg-paper-200 border border-navy-900 px-1.5 py-0.5 rounded text-[10px]">
            PASSIVE ONLY
          </span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <span className="text-grey-500">Check Budget:</span>
          <span className="text-grey-700">5.0s per check</span>
        </div>
      </div>
    </div>
  );
}
