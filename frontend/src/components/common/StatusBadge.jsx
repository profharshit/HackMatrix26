import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'md', showIcon = true }) {
  const norm = (status || '').toLowerCase();

  let styles = 'bg-[#f4f4f5] text-grey-800 border-navy-900';
  let label = status || 'UNKNOWN';
  let Icon = HelpCircle;

  if (norm === 'safe' || norm === 'trusted' || norm === 'legitimate' || norm === 'confirmed safe') {
    styles = 'bg-[#dcfce7] text-emerald-950 border-emerald-900';
    label = 'SAFE // TRUSTED';
    Icon = ShieldCheck;
  } else if (norm === 'suspicious' || norm === 'warning' || norm === 'investigating' || norm === 'pending verification') {
    styles = 'bg-[#fef3c7] text-amber-950 border-amber-900';
    label = 'SUSPICIOUS // CAUTION';
    Icon = AlertTriangle;
  } else if (norm === 'dangerous' || norm === 'phishing' || norm === 'malicious' || norm === 'active threat' || norm === 'confirmed phishing') {
    styles = 'bg-[#fee2e2] text-red-950 border-red-900';
    label = 'DANGEROUS // THREAT';
    Icon = AlertOctagon;
  }

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[10px]' 
    : size === 'lg' 
      ? 'px-3 py-1.5 text-xs font-bold' 
      : 'px-2.5 py-1 text-[11px] font-bold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border uppercase tracking-wider font-mono shadow-sm ${styles} ${sizeClasses}`}>
      {showIcon && <Icon className={size === 'lg' ? 'w-3.5 h-3.5' : 'w-3 h-3'} />}
      <span>{label}</span>
    </span>
  );
}
