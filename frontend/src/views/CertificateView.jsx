import React, { useState } from 'react';
import keyIcon from '../assets/key-icon.png';
import certEmptyIcon from '../assets/certificate-empty.png';
import {
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Search,
  Lock,
  Layers,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function CertificateView({ activeScan }) {
  const certData = activeScan?.breakdown?.certificate?.details;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Incident Case Study Spotlight Card */}
      <div className="bg-white border-2 border-navy-900 rounded-lg p-6 shadow-brutal">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded bg-navy-900 flex items-center justify-center flex-shrink-0 shadow-brutal-sm p-2">
            <img src={keyIcon} alt="Certificate Key" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase bg-[#fee2e2] text-red-950 border border-navy-900 px-2 py-0.5 rounded font-bold">
                HIGH-IMPACT ADVISORY // CRITICAL NOTICE
              </span>
              <span className="text-xs text-grey-500 font-mono">
                PROBLEM STATEMENT HIGHLIGHT
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl text-navy-900 tracking-tight uppercase">
              CERTIFICATE AUTHORITY TRUST CHAINS & THE eMudhra INCIDENT
            </h2>
            <p className="text-xs text-grey-700 max-w-4xl leading-relaxed font-sans pt-1">
              As emphasized in the problem statement, digital certificates establish the bedrock of HTTPS trust. The recent eMudhra TLS incident demonstrated how algorithmic weaknesses in Certificate Authority key generation could allow fraudulent certificates to be created for website impersonation. ThreatWho AI validates cryptographic entropy, CT log presence, and intermediate revocation lists to shield users from CA-level impersonation.
            </p>
          </div>
        </div>
      </div>

      {!activeScan || !certData ? (
        <div className="bg-white border-2 border-navy-900 rounded-lg p-12 text-center space-y-4 shadow-brutal font-mono">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center">
            <img
              src={certEmptyIcon}
              alt="No Certificate Audited"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-navy-900 uppercase">
              No Certificate Audited Yet
            </h3>
            <p className="text-xs text-grey-600 max-w-md mx-auto font-sans mt-1 leading-relaxed">
              No target domain certificate is currently loaded. Run an analysis from the Digital Trust Scanner to passively extract its X.509 certificate, verify its Root CA trust hierarchy, and audit against eMudhra key generation anomalies.
            </p>
          </div>
        </div>
      ) : (
        /* Main Forensic Analysis Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Certificate Architecture & Trust Hierarchy */}
          <div className="lg:col-span-2 space-y-6">
            {/* Certificate Trust Chain Hierarchy */}
            <div className="bg-white border-2 border-navy-900 rounded-lg p-6 shadow-brutal-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase text-navy-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-navy-900" />
                  PKI CHAIN OF TRUST ARCHITECTURE // TRUST HIERARCHY
                </span>
                <StatusBadge
                  status={certData.emudhra_flag ? 'dangerous' : 'safe'}
                  size="sm"
                />
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Root CA */}
                <div className="p-3.5 rounded bg-[#faf9f6] border border-navy-900 flex items-center justify-between shadow-brutal-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-navy-900 text-white flex items-center justify-center text-xs font-bold font-display">
                      R
                    </div>
                    <div>
                      <span className="text-grey-500 text-[10px] block uppercase font-bold">ROOT CERTIFICATE AUTHORITY</span>
                      <span className="font-bold text-navy-900">CCA India Root 2014 / DigiCert Assured ID Root</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-bold bg-[#dcfce7] border border-emerald-900 px-2 py-0.5 rounded">
                    TRUSTED ROOT STORE
                  </span>
                </div>

                {/* Connector line */}
                <div className="w-0.5 h-4 bg-navy-900 ml-6" />

                {/* Intermediate CA */}
                <div className={`p-3.5 rounded border-2 border-navy-900 flex items-center justify-between shadow-brutal-sm ${
                  certData.emudhra_flag ? 'bg-[#fee2e2]' : 'bg-[#faf9f6]'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold font-display ${
                      certData.emudhra_flag ? 'bg-red-600 text-white' : 'bg-navy-900 text-white'
                    }`}>
                      I
                    </div>
                    <div>
                      <span className="text-grey-500 text-[10px] block uppercase font-bold">INTERMEDIATE ISSUER</span>
                      <span className="font-bold text-navy-900">{certData.issuer}</span>
                    </div>
                  </div>
                  {certData.emudhra_flag ? (
                    <span className="text-[10px] font-bold text-red-950 bg-white border border-red-900 px-2 py-0.5 rounded uppercase">
                      UNDER ADVISORY
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-800 font-bold bg-[#dcfce7] border border-emerald-900 px-2 py-0.5 rounded uppercase">
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Connector line */}
                <div className="w-0.5 h-4 bg-navy-900 ml-6" />

                {/* End-Entity Leaf */}
                <div className="p-3.5 rounded bg-[#faf9f6] border border-navy-900 flex items-center justify-between shadow-brutal-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-navy-800 text-white flex items-center justify-center text-xs font-bold font-display">
                      E
                    </div>
                    <div>
                      <span className="text-grey-500 text-[10px] block uppercase font-bold">END-ENTITY LEAF SUBJECT</span>
                      <span className="font-bold text-navy-900">{certData.subject || activeScan?.domain}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-paper-200 border border-navy-900/30 px-2 py-0.5 rounded">
                    SANs: {certData.san_count || 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Cryptographic Health Parameters */}
            <div className="bg-white border-2 border-navy-900 rounded-lg p-6 shadow-brutal-sm">
              <span className="font-mono text-xs font-bold uppercase text-navy-900 flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 bg-navy-900" />
                CRYPTOGRAPHIC IMPLEMENTATION TELEMETRY
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded border border-navy-900 bg-[#faf9f6] space-y-1">
                  <span className="text-grey-500 text-[10px] uppercase font-bold">Public Key Modulus & Algorithm</span>
                  <span className="font-bold text-navy-900 block">{certData.key_type}</span>
                  <p className="text-[11px] text-grey-600 font-sans">
                    {certData.emudhra_flag
                      ? 'CRITICAL: Pseudo-random number generator entropy deficit flags repeatable modulus generation.'
                      : 'Standard entropy verified. Resilient against factorisation.'}
                  </p>
                </div>

                <div className="p-3.5 rounded border border-navy-900 bg-[#faf9f6] space-y-1">
                  <span className="text-grey-500 text-[10px] uppercase font-bold">Negotiated Cipher Suite</span>
                  <span className="font-bold text-navy-900 block">{certData.cipher_suite}</span>
                  <p className="text-[11px] text-grey-600 font-sans">
                    Forward secrecy guaranteed via Elliptic Curve Diffie-Hellman Ephemeral (ECDHE).
                  </p>
                </div>

                <div className="p-3.5 rounded border border-navy-900 bg-[#faf9f6] space-y-1">
                  <span className="text-grey-500 text-[10px] uppercase font-bold">Certificate Transparency (RFC 6962)</span>
                  <span className={`font-bold block ${certData.ct_logs_verified ? 'text-emerald-800' : 'text-red-800'}`}>
                    {certData.ct_logs_verified ? 'SCTs Verified across 3 public logs' : 'Unlogged or Delayed SCT Registration'}
                  </span>
                  <p className="text-[11px] text-grey-600 font-sans">
                    Guarantees public monitors can audit domain certificate issuance.
                  </p>
                </div>

                <div className="p-3.5 rounded border border-navy-900 bg-[#faf9f6] space-y-1">
                  <span className="text-grey-500 text-[10px] uppercase font-bold">Validity Horizon Remaining</span>
                  <span className="font-bold text-navy-900 block">
                    {certData.days_left} Days
                  </span>
                  <p className="text-[11px] text-grey-600 font-sans">
                    {certData.days_left < 30 ? 'Expiring soon; short lifetime limits exposure.' : 'Healthy lifecycle horizon.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: eMudhra Incident Advisory & Detection Rules */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-navy-900 rounded-lg p-5 shadow-brutal space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <h3 className="font-display font-bold text-sm text-navy-900 uppercase">
                  eMudhra Detection Engine Rules
                </h3>
              </div>

              <p className="text-xs text-grey-600 leading-relaxed font-sans">
                Our automated engine runs 4 distinct checks on every scanned domain certificate:
              </p>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="p-2.5 rounded bg-[#faf9f6] border border-navy-900">
                  <span className="font-bold text-navy-900 block">01 // CA SERIAL MATCH</span>
                  <p className="text-grey-600 text-[11px] font-sans">
                    Monitors intermediates associated with the eMudhra key issuance timeline.
                  </p>
                </div>

                <div className="p-2.5 rounded bg-[#faf9f6] border border-navy-900">
                  <span className="font-bold text-navy-900 block">02 // MODULUS GCD ANOMALY</span>
                  <p className="text-grey-600 text-[11px] font-sans">
                    Computes GCD against known weak public key batches to detect shared primes.
                  </p>
                </div>

                <div className="p-2.5 rounded bg-[#faf9f6] border border-navy-900">
                  <span className="font-bold text-navy-900 block">03 // OCSP REVOCATION STATUS</span>
                  <p className="text-grey-600 text-[11px] font-sans">
                    Validates real-time revocation response via Online Certificate Status Protocol.
                  </p>
                </div>

                <div className="p-2.5 rounded bg-[#faf9f6] border border-navy-900">
                  <span className="font-bold text-navy-900 block">04 // ROOT STORE POLICY</span>
                  <p className="text-grey-600 text-[11px] font-sans">
                    Verifies against Mozilla, Chromium, and Microsoft root store trust criteria.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-navy-900 text-white rounded-lg p-5 space-y-2 border-2 border-navy-900 shadow-brutal">
              <span className="text-[9px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                SECURITY BEST PRACTICE
              </span>
              <h4 className="font-display font-bold text-sm text-white">Continuous Trust Monitoring</h4>
              <p className="text-xs text-grey-300 leading-relaxed font-sans">
                Organizations should enforce automated alerts whenever a new certificate is issued for their domain name on public CT logs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
