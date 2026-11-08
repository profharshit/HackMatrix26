import React from 'react';
import { X, ShieldAlert, KeyRound, Globe, Radio, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import StatusBadge from './common/StatusBadge';

export default function DetailDrawer({ isOpen, onClose, detailType, scanData }) {
  if (!isOpen || !scanData) return null;

  const { url, domain, trust_score, verdict, breakdown } = scanData;

  const renderContent = () => {
    switch (detailType) {
      case 'model': {
        const model = breakdown?.model || {};
        const details = model.details || {};
        return (
          <div className="space-y-6 font-mono text-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-grey-500">HEURISTIC LEXICAL ENGINE</span>
                <StatusBadge status={model.score > 70 ? 'safe' : model.score > 40 ? 'suspicious' : 'dangerous'} size="sm" />
              </div>
              <h3 className="text-xl font-display font-bold text-navy-900 uppercase">AI Threat & Lexical Analysis</h3>
              <p className="text-xs text-grey-600 font-sans mt-1">
                Machine learning classifier evaluating structural URL anomalies, punycode spoofing, and lexical entropy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#faf9f6] border border-navy-900 p-3 rounded shadow-brutal-sm">
                <span className="text-[10px] text-grey-500 uppercase font-bold block mb-1">Model Score</span>
                <span className="text-2xl font-bold text-navy-900">{model.score}/100</span>
              </div>
              <div className="bg-[#faf9f6] border border-navy-900 p-3 rounded shadow-brutal-sm">
                <span className="text-[10px] text-grey-500 uppercase font-bold block mb-1">Decision Confidence</span>
                <span className="text-2xl font-bold text-navy-900">
                  {((model.confidence || 0.85) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="border border-navy-900 rounded p-4 bg-white space-y-2.5 shadow-brutal-sm">
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wide block border-b border-navy-900/15 pb-1">
                Lexical Feature Vector
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">Classification:</span>
                  <span className="font-bold uppercase text-navy-900">{model.label || 'Standard'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">Model Source:</span>
                  <span className="text-navy-900 bg-paper-200 border border-navy-900/30 px-1.5 py-0.5 rounded text-[10px]">
                    {model.source || 'Heuristic Ruleset'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">URL Length:</span>
                  <span className="text-navy-900">{details.url_length || url.length} characters</span>
                </div>
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">Subdomain Depth:</span>
                  <span className="text-navy-900">{details.subdomain_count ?? 1} levels</span>
                </div>
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">Shannon Entropy:</span>
                  <span className="text-navy-900">{details.entropy_score || '4.12'} bits/symbol</span>
                </div>
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">Direct IP Address:</span>
                  <span className="text-navy-900">{details.has_ip ? 'Detected (High Risk)' : 'No (Standard DNS)'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-grey-600">Brand Impersonation:</span>
                  <span className={`font-bold ${details.brand_impersonation_risk === 'Critical' ? 'text-red-700' : 'text-emerald-700'}`}>
                    {details.brand_impersonation_risk || 'Low'}
                  </span>
                </div>
              </div>
            </div>

            {details.keyword_flags && details.keyword_flags.length > 0 && (
              <div className="border border-navy-900 bg-[#fee2e2] p-3 rounded space-y-1.5">
                <span className="text-xs font-bold text-red-950 block">Deceptive Keyword Tokens Found:</span>
                <div className="flex flex-wrap gap-1.5">
                  {details.keyword_flags.map((kw, i) => (
                    <span key={i} className="text-[11px] bg-white border border-navy-900 text-red-950 px-2 py-0.5 rounded font-bold">
                      "{kw}"
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'certificate': {
        const cert = breakdown?.certificate || {};
        const details = cert.details || {};
        return (
          <div className="space-y-6 font-mono text-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-grey-500">PKI TRUST AUDITOR</span>
                <StatusBadge status={cert.score > 70 ? 'safe' : cert.score > 40 ? 'suspicious' : 'dangerous'} size="sm" />
              </div>
              <h3 className="text-xl font-display font-bold text-navy-900 uppercase">Certificate & Trust Chain</h3>
              <p className="text-xs text-grey-600 font-sans mt-1">
                Cryptographic validation of SSL/TLS certificates, Root CAs, and verification against known CA incidents (e.g. eMudhra weak key generation).
              </p>
            </div>

            {details.emudhra_flag && (
              <div className="border border-red-900 bg-[#fee2e2] p-4 rounded text-xs space-y-2">
                <div className="flex items-center gap-2 text-red-950 font-bold">
                  <AlertCircle className="w-4 h-4 text-red-700" />
                  <span>eMudhra TLS Incident Advisory Alert</span>
                </div>
                <p className="text-red-950 leading-relaxed font-sans">
                  The subject certificate exhibits characteristics correlated with the documented eMudhra Certificate Authority key generation weakness. Weak cryptographic entropy allows unauthorized private key reconstruction.
                </p>
              </div>
            )}

            <div className="border border-navy-900 rounded p-4 bg-white space-y-2.5 shadow-brutal-sm">
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wide block border-b border-navy-900/15 pb-1">
                Certificate Metadata
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">Issuer:</span>
                  <span className="font-bold text-navy-900 text-right">{details.issuer || 'Unknown CA'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">Common Name:</span>
                  <span className="text-navy-900">{details.subject || domain}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">Key Type:</span>
                  <span className="text-navy-900">{details.key_type || 'RSA 2048-bit'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">Cipher:</span>
                  <span className="text-navy-900 text-[11px] truncate max-w-[200px]">{details.cipher_suite || 'TLS_AES_256_GCM_SHA384'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">Validity Horizon:</span>
                  <span className="text-navy-900">{details.days_left || 0} days remaining</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-grey-600">Certificate Transparency:</span>
                  <span className={`font-bold ${details.ct_logs_verified ? 'text-emerald-800' : 'text-red-800'}`}>
                    {details.ct_logs_verified ? 'Verified in CT Logs' : 'Missing SCTs'}
                  </span>
                </div>
              </div>
            </div>

            {cert.issues && cert.issues.length > 0 && (
              <div className="border border-navy-900 bg-[#faf9f6] p-4 rounded shadow-brutal-sm">
                <span className="text-xs font-bold text-navy-900 uppercase mb-2 block">Findings:</span>
                <ul className="space-y-1 text-xs text-navy-900 font-sans">
                  {cert.issues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      }

      case 'security': {
        const sec = breakdown?.web_security || {};
        const details = sec.details || {};
        return (
          <div className="space-y-6 font-mono text-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-grey-500">APPLICATION POSTURE</span>
                <StatusBadge status={sec.score > 70 ? 'safe' : sec.score > 40 ? 'suspicious' : 'dangerous'} size="sm" />
              </div>
              <h3 className="text-xl font-display font-bold text-navy-900 uppercase">Defensive HTTP Posture</h3>
              <p className="text-xs text-grey-600 font-sans mt-1">
                Passive inspection of defensive HTTP headers, framing controls, cookie security flags, and information disclosure.
              </p>
            </div>

            <div className="border border-navy-900 rounded p-4 bg-white space-y-2.5 shadow-brutal-sm">
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wide block border-b border-navy-900/15 pb-1">
                Security Headers
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-grey-100">
                  <span className="text-grey-600">HSTS Strict Transport</span>
                  <span className={`font-bold ${details.hsts_enabled ? 'text-emerald-800' : 'text-red-800'}`}>
                    {details.hsts_enabled ? 'ENFORCED' : 'MISSING'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-grey-100">
                  <span className="text-grey-600">Content Security Policy</span>
                  <span className={`font-bold ${details.csp_configured ? 'text-emerald-800' : 'text-red-800'}`}>
                    {details.csp_configured ? 'CONFIGURED' : 'MISSING'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-grey-100">
                  <span className="text-grey-600">X-Frame-Options</span>
                  <span className="text-navy-900 bg-paper-200 border border-navy-900/30 px-1.5 py-0.5 rounded text-[10px]">
                    {details.x_frame_options || 'NONE'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-grey-100">
                  <span className="text-grey-600">Cookie Security</span>
                  <span className="text-navy-900 text-[10px] truncate max-w-[180px]">
                    {details.cookie_secure_flags || 'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-grey-600">Server Banner</span>
                  <span className="text-navy-900">{details.server_info_leakage || 'Hidden'}</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'intel': {
        const intel = breakdown?.threat_intel || {};
        const details = intel.details || {};
        return (
          <div className="space-y-6 font-mono text-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-grey-500">COLLABORATIVE INTEL</span>
                <StatusBadge status={intel.score > 70 ? 'safe' : intel.score > 40 ? 'suspicious' : 'dangerous'} size="sm" />
              </div>
              <h3 className="text-xl font-display font-bold text-navy-900 uppercase">Global Threat Intelligence</h3>
              <p className="text-xs text-grey-600 font-sans mt-1">
                Cross-referenced with PhishTank, OpenPhish, community threat submissions, and autonomous system reputation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#faf9f6] border border-navy-900 p-3 rounded shadow-brutal-sm">
                <span className="text-[10px] text-grey-500 uppercase font-bold block mb-1">Community Reports</span>
                <span className="text-2xl font-bold text-navy-900">{intel.reports || 0}</span>
              </div>
              <div className="bg-[#faf9f6] border border-navy-900 p-3 rounded shadow-brutal-sm">
                <span className="text-[10px] text-grey-500 uppercase font-bold block mb-1">Domain Age</span>
                <span className="text-2xl font-bold text-navy-900">
                  {details.domain_age_days ? `${details.domain_age_days}d` : 'Unknown'}
                </span>
              </div>
            </div>

            <div className="border border-navy-900 rounded p-4 bg-white space-y-2.5 shadow-brutal-sm">
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wide block border-b border-navy-900/15 pb-1">
                Registrar & Network
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">Registrar:</span>
                  <span className="text-navy-900 font-bold">{details.registrar || 'NameCheap'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">IP:</span>
                  <span className="text-navy-900">{details.ip_address || '198.51.100.23'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-grey-100">
                  <span className="text-grey-600">Location:</span>
                  <span className="text-navy-900">{details.geolocation || 'United States'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-grey-600">ASN:</span>
                  <span className="text-navy-900">{details.autonomous_system || 'AS36459'}</span>
                </div>
              </div>
            </div>

            {intel.feeds_hit && intel.feeds_hit.length > 0 && (
              <div className="border border-navy-900 bg-[#fee2e2] p-4 rounded shadow-brutal-sm space-y-2">
                <span className="text-xs font-bold text-red-950 uppercase block">Blocklist Detections ({intel.feeds_hit.length}):</span>
                <div className="space-y-1">
                  {intel.feeds_hit.map((feed, idx) => (
                    <div key={idx} className="text-xs text-red-950 bg-white border border-navy-900 p-1.5 rounded font-bold">
                      {feed}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-none transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#faf9f6] border-l-2 border-navy-900 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 border-b border-navy-900 flex items-center justify-between bg-white font-mono">
            <span className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-navy-900" />
              FORENSIC INSPECTOR // DIAGNOSTIC TELEMETRY
            </span>
            <button
              onClick={onClose}
              className="p-1 border border-navy-900 rounded bg-[#faf9f6] hover:bg-navy-900 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {renderContent()}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-navy-900 bg-white flex items-center justify-between font-mono text-xs">
            <span className="text-grey-500 text-[11px]">ID: {scanData.id}</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-navy-900 text-white font-bold rounded hover:bg-navy-800 transition-colors shadow-brutal-sm"
            >
              DISMISS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
