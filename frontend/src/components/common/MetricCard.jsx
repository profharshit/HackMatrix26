import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function MetricCard({
  title,
  score,
  status,
  subtitle,
  icon: Icon,
  issuesCount = 0,
  onClick,
  actionLabel = 'Inspect Details'
}) {
  const isHealthy = score >= 80;
  const isWarning = score >= 40 && score < 80;
  const isThreat = score < 40;

  let scoreColor = 'text-navy-900';
  let barBg = 'bg-navy-900';
  if (isHealthy) {
    scoreColor = 'text-emerald-700';
    barBg = 'bg-emerald-600';
  } else if (isWarning) {
    scoreColor = 'text-amber-700';
    barBg = 'bg-amber-500';
  } else if (isThreat) {
    scoreColor = 'text-red-700';
    barBg = 'bg-red-600';
  }

  return (
    <div className="bg-white border border-grey-200 rounded-lg p-5 hover:border-navy-300 transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="w-8 h-8 rounded bg-grey-100 border border-grey-200 flex items-center justify-center text-navy-900">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <h3 className="text-sm font-semibold text-navy-900 tracking-tight">{title}</h3>
          </div>
          {status && (
            <span className="text-xs font-mono font-medium text-grey-500 uppercase">
              {status}
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-mono font-bold ${scoreColor}`}>
              {score ?? '--'}
            </span>
            <span className="text-xs font-mono text-grey-400">/100</span>
          </div>

          {issuesCount > 0 ? (
            <span className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
              {issuesCount} {issuesCount === 1 ? 'issue' : 'issues'}
            </span>
          ) : (
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Clean
            </span>
          )}
        </div>

        {/* Minimal progress meter: solid, no gradient */}
        <div className="w-full bg-grey-100 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full ${barBg} transition-all duration-500`}
            style={{ width: `${Math.min(100, Math.max(0, score || 0))}%` }}
          />
        </div>

        {subtitle && (
          <p className="text-xs text-grey-600 leading-relaxed mb-4 line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>

      {onClick && (
        <button
          onClick={onClick}
          className="mt-2 pt-3 border-t border-grey-100 flex items-center justify-between text-xs font-medium text-navy-800 hover:text-navy-600 group"
        >
          <span>{actionLabel}</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
