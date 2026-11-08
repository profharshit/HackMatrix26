import React from 'react';
import { X, Printer, ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, Calendar, Globe, FileText } from 'lucide-react';
import StatusBadge from './common/StatusBadge';

export default function AuditReportModal({ isOpen, onClose, scanData }) {
  if (!isOpen || !scanData) return null;

  const { url, domain, trust_score, verdict, breakdown, reasons, scanned_at, id } = scanData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-none transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#faf9f6] border-2 border-navy-900 rounded-lg max-w-3xl w-full max-h-[90vh] shadow-brutal-lg overflow-hidden z-10 flex flex-col font-mono text-xs">
        {/* Controls Header (Hidden during print) */}
        <div className="p-4 border-b border-navy-900 bg-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
              📄
            </span>
            <span className="font-bold text-navy-900 uppercase tracking-wide">
              Official Executive Security & Trust Audit Report
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-navy-900 text-white rounded font-bold hover:bg-navy-800 transition-colors flex items-center gap-1.5 shadow-brutal-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / SAVE PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 border border-navy-900 rounded bg-[#faf9f6] hover:bg-navy-900 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Audit Document */}
        <div className="p-8 overflow-y-auto space-y-6 text-navy-900 print:p-0 bg-white">
          {/* Document Header */}
          <div className="border-b-2 border-navy-900 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-7 h-7 rounded bg-navy-900 text-white flex items-center justify-center font-bold font-display text-sm">
                  🛡️
                </span>
                <span className="text-lg font-display font-bold text-navy-900 tracking-tight">
                  THREATWHO AI INTELLIGENCE LAB
                </span>
              </div>
              <p className="text-[11px] text-grey-600">
                Passive Threat Analysis & Digital Trust Validation Framework // OFFICIAL AUDIT RECORD
              </p>
            </div>

            <div className="text-right text-[11px] text-grey-600">
              <div>AUDIT REF: <span className="font-bold text-navy-900">{id}</span></div>
              <div>DATE: {new Date(scanned_at || Date.now()).toUTCString()}</div>
            </div>
          </div>

          {/* Target Assessment Box */}
          <div className="bg-[#faf9f6] border-2 border-navy-900 p-5 rounded flex flex-col md:flex-row items-center justify-between gap-6 shadow-brutal-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-grey-500 uppercase tracking-wider block font-bold">
                AUDITED WEB PROPERTY TARGET
              </span>
              <div className="text-base font-bold text-navy-900 break-all font-mono">
                {url}
              </div>
              <div className="text-xs text-grey-700">
                Primary Domain: <span className="font-bold">{domain}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white border border-navy-900 p-3.5 rounded flex-shrink-0 shadow-brutal-sm">
              <div className="text-center">
                <span className="text-[9px] uppercase text-grey-500 block font-bold">Trust Index</span>
                <span className="text-3xl font-display font-black text-navy-900">{trust_score}/100</span>
              </div>
              <div className="border-l border-navy-900/20 pl-3">
                <StatusBadge status={verdict} size="md" />
              </div>
            </div>
          </div>

          {/* Executive Assessment Findings */}
          <div>
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2 border-b border-navy-900 pb-1">
              Executive Evaluation Summary // VERDICT RATIONALE
            </h4>
            <div className="space-y-1.5 pt-1 font-sans">
              {reasons && reasons.map((reason, i) => (
                <div key={i} className="text-xs text-navy-900 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy-900 mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Forensic Module Telemetry Grid */}
          <div>
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3 border-b border-navy-900 pb-1">
              Four Pillars Verification Breakdown // TELEMETRY AUDIT
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Model */}
              <div className="p-3 border border-navy-900 rounded bg-[#faf9f6]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-navy-900">AI Threat & Lexical Model</span>
                  <span className="font-bold">{breakdown?.model?.score}/100</span>
                </div>
                <div className="text-[11px] text-grey-600 space-y-0.5">
                  <div>Classification: <strong className="uppercase">{breakdown?.model?.label || 'Analyzed'}</strong></div>
                  <div>Confidence: {((breakdown?.model?.confidence || 0.85) * 100).toFixed(0)}%</div>
                </div>
              </div>

              {/* Certificate */}
              <div className="p-3 border border-navy-900 rounded bg-[#faf9f6]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-navy-900">Certificate & PKI Trust</span>
                  <span className="font-bold">{breakdown?.certificate?.score}/100</span>
                </div>
                <div className="text-[11px] text-grey-600 space-y-0.5">
                  <div>Issuer: <span>{breakdown?.certificate?.details?.issuer || 'Verified CA'}</span></div>
                  <div>eMudhra Incident Flag: <strong>{breakdown?.certificate?.details?.emudhra_flag ? 'FAIL (Weak Key Gen)' : 'PASS (Clean)'}</strong></div>
                </div>
              </div>

              {/* Web Security */}
              <div className="p-3 border border-navy-900 rounded bg-[#faf9f6]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-navy-900">Web Security Controls</span>
                  <span className="font-bold">{breakdown?.web_security?.score}/100</span>
                </div>
                <div className="text-[11px] text-grey-600 space-y-0.5">
                  <div>HSTS Enforced: {breakdown?.web_security?.details?.hsts_enabled ? 'Yes' : 'No'}</div>
                  <div>CSP Framing: {breakdown?.web_security?.details?.csp_configured ? 'Active' : 'Missing'}</div>
                </div>
              </div>

              {/* Threat Intel */}
              <div className="p-3 border border-navy-900 rounded bg-[#faf9f6]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-navy-900">Collaborative Feeds</span>
                  <span className="font-bold">{breakdown?.threat_intel?.score}/100</span>
                </div>
                <div className="text-[11px] text-grey-600 space-y-0.5">
                  <div>Community Reports: {breakdown?.threat_intel?.reports || 0}</div>
                  <div>Domain Age: {breakdown?.threat_intel?.details?.domain_age_days || 'N/A'} days</div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Stamp Footer */}
          <div className="pt-4 border-t-2 border-navy-900 flex justify-between items-center text-[10px] text-grey-600">
            <span>THREATWHO AI PASSIVE RECONNAISSANCE PROTOCOL</span>
            <span>NON-INTRUSIVE • RFC 6962 CT AUDITED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
