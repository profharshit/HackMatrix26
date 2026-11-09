import React, { useState } from 'react';
import worldwideVideo from '../assets/worldwide.mp4';
import {
  Globe2,
  Search,
  Server,
  MapPin,
  Calendar,
  AlertOctagon,
  CheckCircle2,
  Shield,
  Clock,
  ArrowRight
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { getDomainIntel } from '../services/api';

export default function DomainLookupView({ onAnalyzeUrl }) {
  const [domainInput, setDomainInput] = useState('');
  const [intelData, setIntelData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (domainToQuery) => {
    const target = domainToQuery || domainInput;
    if (!target.trim()) return;

    setLoading(true);
    try {
      const data = await getDomainIntel(target);
      setIntelData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Banner */}
      <div className="bg-white border-2 border-navy-900 rounded-lg p-6 shadow-brutal">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center flex-shrink-0">
            <video
              src={worldwideVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase bg-[#e2e8f0] text-navy-950 border border-navy-900 px-2 py-0.5 rounded font-bold">
                NETWORK & WHOIS TELEMETRY // RECONNAISSANCE
              </span>
              <span className="text-xs text-grey-500 font-mono">
                API: GET /api/intel/&#123;domain&#125;
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl text-navy-900 tracking-tight uppercase">
              Domain Intelligence & WHOIS Reconnaissance
            </h2>
            <p className="text-xs text-grey-700 mt-1 max-w-3xl leading-relaxed font-sans">
              Query comprehensive network telemetry for any domain: registration age, accredited registrar identity, IP geolocation, Autonomous System Number (ASN), and blocklist mentions.
            </p>

            {/* Input Bar */}
            <div className="mt-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLookup();
                }}
                className="flex flex-col sm:flex-row gap-2 font-mono"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-grey-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    placeholder="Enter domain (e.g. github.com or fake-bank-portal.cc)"
                    className="w-full pl-9 pr-4 py-3 bg-[#faf9f6] border border-navy-900 rounded text-xs text-navy-900 focus:outline-none focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !domainInput.trim()}
                  className="px-6 py-3 bg-navy-900 text-white rounded font-bold text-xs hover:bg-navy-800 disabled:opacity-50 transition-colors shadow-brutal-sm uppercase"
                >
                  <span>{loading ? 'Querying...' : 'Fetch Domain Intel →'}</span>
                </button>
              </form>

              {/* Preset Domain Quick Chips */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-grey-500 text-[11px] uppercase font-bold">Quick Examples:</span>
                {['github.com', 'stripe.com', 'wikipedia.org'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDomainInput(d);
                      handleLookup(d);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#faf9f6] hover:bg-white border border-navy-900 text-navy-900 transition-colors shadow-brutal-sm"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!intelData ? (
        <div className="bg-white border-2 border-navy-900 rounded-lg p-12 text-center space-y-4 shadow-brutal font-mono">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center">
            <video
              src={worldwideVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-navy-900 uppercase">
              No Domain Queried Yet
            </h3>
            <p className="text-xs text-grey-600 max-w-md mx-auto font-sans mt-1 leading-relaxed">
              Enter any domain in the search bar above to fetch ICANN WHOIS registrar records, IP geolocation, Autonomous System Number (ASN), and active blocklist hits.
            </p>
          </div>
        </div>
      ) : (
        /* Domain Intel Card */
        <div className="bg-white border-2 border-navy-900 rounded-lg p-6 shadow-brutal space-y-6 font-mono text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-navy-900/15">
            <div>
              <span className="text-[10px] text-grey-500 uppercase block font-bold">Targeted Domain Asset</span>
              <h3 className="text-2xl font-display font-bold text-navy-900">{intelData.domain}</h3>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={intelData.verdict} size="md" />
              <button
                onClick={() => onAnalyzeUrl(`https://${intelData.domain}`)}
                className="px-4 py-2 bg-navy-900 text-white rounded font-bold hover:bg-navy-800 transition-colors shadow-brutal-sm flex items-center gap-1.5 uppercase"
              >
                <span>Run Passive Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded bg-[#faf9f6] border border-navy-900 space-y-1 shadow-brutal-sm">
              <div className="flex items-center gap-1.5 text-grey-500 text-[10px] font-bold uppercase">
                <Calendar className="w-3.5 h-3.5" />
                <span>Domain Age</span>
              </div>
              <span className="text-xl font-bold text-navy-900 block">
                {intelData.details?.domain_age_days ? `${intelData.details.domain_age_days} Days` : 'Unknown'}
              </span>
              <p className="text-[11px] text-grey-600 font-sans">
                {intelData.details?.domain_age_days < 30 ? 'High Risk: Fresh domain' : 'Established historical baseline'}
              </p>
            </div>

            <div className="p-4 rounded bg-[#faf9f6] border border-navy-900 space-y-1 shadow-brutal-sm">
              <div className="flex items-center gap-1.5 text-grey-500 text-[10px] font-bold uppercase">
                <Server className="w-3.5 h-3.5" />
                <span>Registrar</span>
              </div>
              <span className="text-sm font-bold text-navy-900 block truncate">
                {intelData.details?.registrar || 'Privacy Protected'}
              </span>
              <p className="text-[11px] text-grey-600 font-sans truncate">
                ICANN Accredited
              </p>
            </div>

            <div className="p-4 rounded bg-[#faf9f6] border border-navy-900 space-y-1 shadow-brutal-sm">
              <div className="flex items-center gap-1.5 text-grey-500 text-[10px] font-bold uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>Hosting Location</span>
              </div>
              <span className="text-sm font-bold text-navy-900 block truncate">
                {intelData.details?.geolocation || 'Global Anycast'}
              </span>
              <p className="text-[11px] text-grey-600 font-sans truncate">
                {intelData.details?.ip_address || '198.51.100.23'}
              </p>
            </div>

            <div className="p-4 rounded bg-[#faf9f6] border border-navy-900 space-y-1 shadow-brutal-sm">
              <div className="flex items-center gap-1.5 text-grey-500 text-[10px] font-bold uppercase">
                <Shield className="w-3.5 h-3.5" />
                <span>Autonomous System</span>
              </div>
              <span className="text-sm font-bold text-navy-900 block truncate">
                {intelData.details?.autonomous_system || 'AS36459'}
              </span>
              <p className="text-[11px] text-grey-600 font-sans">BGP Routing Peer</p>
            </div>
          </div>

          {/* Blocklist Detections */}
          {intelData.feeds_hit && intelData.feeds_hit.length > 0 && (
            <div className="p-4 rounded border-2 border-navy-900 bg-[#fee2e2] space-y-2 shadow-brutal-sm">
              <div className="flex items-center gap-2 text-red-950 font-bold text-xs uppercase">
                <AlertOctagon className="w-4 h-4 text-red-700" />
                <span>Flagged in Threat Intelligence Databases ({intelData.feeds_hit.length}):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {intelData.feeds_hit.map((feed, i) => (
                  <span key={i} className="text-xs bg-white border border-navy-900 text-red-950 px-2 py-0.5 rounded font-bold">
                    {feed}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
