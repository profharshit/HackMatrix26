import React from 'react';
import gearVideo from '../assets/gear.mp4';
import {
  FileCode2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Layers,
  Cookie,
  Server,
  Lock
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function WebSecurityView({ activeScan }) {
  const secDetails = activeScan?.breakdown?.web_security?.details;
  const secScore = activeScan?.breakdown?.web_security?.score;

  const headerChecks = secDetails ? [
    {
      name: 'Strict-Transport-Security (HSTS)',
      passed: secDetails.hsts_enabled,
      severity: 'High',
      desc: 'Enforces HTTPS communication and eliminates SSL stripping downgrade attacks.',
      recommendation: 'Add: max-age=31536000; includeSubDomains; preload'
    },
    {
      name: 'Content-Security-Policy (CSP)',
      passed: secDetails.csp_configured,
      severity: 'Critical',
      desc: 'Restricts sources from which scripts can be loaded; blocks XSS and malicious frame injection.',
      recommendation: "Add: default-src 'self'; script-src 'self' 'nonce-...' https:"
    },
    {
      name: 'X-Frame-Options (Clickjacking Protection)',
      passed: secDetails.x_frame_options !== 'NONE' && secDetails.x_frame_options !== 'Not Defined',
      severity: 'Medium',
      desc: 'Controls whether a browser should be allowed to render a page in a frame or iframe.',
      recommendation: 'Add: DENY or SAMEORIGIN'
    },
    {
      name: 'Cross-Origin Resource Sharing (CORS)',
      passed: !secDetails.cors_misconfiguration,
      severity: 'High',
      desc: 'Prevents arbitrary malicious domains from reading authenticated response payloads.',
      recommendation: 'Avoid wildcard Access-Control-Allow-Origin: * with credentials.'
    },
    {
      name: 'Cookie Security Attributes',
      passed: secDetails.cookie_secure_flags && secDetails.cookie_secure_flags.includes('HttpOnly'),
      severity: 'Medium',
      desc: 'Prevents client-side scripts from harvesting session tokens via document.cookie.',
      recommendation: 'Ensure Secure, HttpOnly, and SameSite=Strict on all auth cookies.'
    },
    {
      name: 'Server Header Disclosure Mitigation',
      passed: !secDetails.server_info_leakage?.includes('nginx/1.') && !secDetails.server_info_leakage?.includes('Apache/2.'),
      severity: 'Low',
      desc: 'Conceals server software version to hinder automated exploit profiling.',
      recommendation: 'Suppress Server, X-Powered-By, and X-AspNet-Version headers.'
    }
  ] : [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Overview Banner */}
      <div className="bg-white border-2 border-navy-900 rounded-lg p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center flex-shrink-0">
            <video
              src={gearVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase bg-[#fed7aa] text-orange-950 border border-navy-900 px-2 py-0.5 rounded font-bold">
                PASSIVE ASSESSMENT // NON-INTRUSIVE
              </span>
              <span className="text-xs text-grey-500 font-mono">
                ZERO PORT PROBING
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl text-navy-900 tracking-tight uppercase">
              Web Application Security & Defensive Posture
            </h2>
            <p className="text-xs text-grey-700 mt-1 max-w-3xl leading-relaxed font-sans">
              Evaluates passive defensive header hygiene, cookie hardening policies, and client-side exposure. Following the challenge guidelines, all checks are passive and inspect only standard HTTP response headers without port probing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center bg-[#faf9f6] border border-navy-900 p-3.5 rounded shadow-brutal-sm font-mono">
          <div>
            <span className="text-[10px] uppercase text-grey-500 block font-bold">Security Score</span>
            <span className="text-2xl font-bold text-navy-900">{secScore !== undefined ? `${secScore}/100` : '-- / 100'}</span>
          </div>
          {secScore !== undefined && (
            <StatusBadge status={secScore >= 80 ? 'safe' : secScore >= 40 ? 'suspicious' : 'dangerous'} size="sm" />
          )}
        </div>
      </div>

      {!activeScan || !secDetails ? (
        <div className="bg-white border-2 border-navy-900 rounded-lg p-12 text-center space-y-4 shadow-brutal font-mono">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center">
            <video
              src={gearVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-navy-900 uppercase">
              No Web Target Audited Yet
            </h3>
            <p className="text-xs text-grey-600 max-w-md mx-auto font-sans mt-1 leading-relaxed">
              No target URL is currently loaded. Run an analysis from the Digital Trust Scanner to passively inspect defensive HTTP headers (HSTS, CSP, X-Frame-Options) and cookie security attributes.
            </p>
          </div>
        </div>
      ) : (
        /* Security Headers Checklist */
        <div className="bg-white border-2 border-navy-900 rounded-lg p-6 shadow-brutal-sm">
          <span className="font-mono text-xs font-bold uppercase text-navy-900 flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 bg-navy-900" />
            DEFENSE-IN-DEPTH HEADER VERIFICATION CHECKLIST // COMPLIANCE AUDIT
          </span>

          <div className="space-y-3 font-mono">
            {headerChecks.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded border-2 border-navy-900 text-xs transition-colors shadow-brutal-sm ${
                  item.passed ? 'bg-[#faf9f6]' : 'bg-[#fffbeb]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {item.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    )}
                    <span className="font-bold text-navy-900 text-sm">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border border-navy-900 ${
                      item.severity === 'Critical'
                        ? 'bg-[#fee2e2] text-red-950'
                        : item.severity === 'High'
                          ? 'bg-[#fed7aa] text-orange-950'
                          : 'bg-paper-200 text-navy-900'
                    }`}>
                      {item.severity} Impact
                    </span>
                    <span className={`text-[11px] font-bold ${
                      item.passed ? 'text-emerald-800' : 'text-amber-800'
                    }`}>
                      {item.passed ? 'ENFORCED' : 'NON-COMPLIANT'}
                    </span>
                  </div>
                </div>

                <p className="text-grey-700 font-sans mb-2 leading-relaxed">{item.desc}</p>

                {!item.passed && (
                  <div className="mt-2 pt-2 border-t border-navy-900/15 text-[11px] text-amber-950 flex items-start gap-1.5">
                    <span className="font-bold uppercase">Remediation:</span>
                    <span>{item.recommendation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
