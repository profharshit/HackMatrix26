import React, { useEffect } from 'react';
import { Lock, Clock, ShieldCheck, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clearScanHistory } from '../services/api';

export default function HistoryView({ onSelectScan }) {
  const { user, isGuest, openAuth } = useAuth();

  useEffect(() => {
    // Clear any previous mock test scans
    clearScanHistory();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Banner */}
      <div className="bg-white border-2 border-navy-900 rounded-lg p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase bg-paper-200 text-navy-950 border border-navy-900 px-2 py-0.5 rounded font-bold">
              OFFLINE AUDIT ARCHIVE // PERSISTENT LOGS
            </span>
          </div>
          <h2 className="font-display font-bold text-2xl text-navy-900 tracking-tight uppercase">
            Security Audit Logs & Replay Records
          </h2>
          <p className="text-xs text-grey-700 mt-1 max-w-2xl leading-relaxed font-sans">
            Persistent cloud audit records, structured machine-readable forensic logs, and timeline security evaluations.
          </p>
        </div>

        {!isGuest && user && (
          <div className="px-3 py-1.5 bg-[#f0f9ff] border border-navy-900 rounded text-xs font-mono flex items-center gap-2 shadow-brutal-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-navy-900">{user.name}</span>
            <span className="text-grey-500 text-[10px]">({user.role})</span>
          </div>
        )}
      </div>

      {/* Conditional Rendering Based on Auth & Publication Status */}
      {isGuest ? (
        /* Guest Gate: Must sign in to access archive */
        <div className="bg-white border-2 border-navy-900 rounded-lg p-12 text-center space-y-5 shadow-brutal font-mono">
          <div className="w-16 h-16 rounded-full border-2 border-navy-900 bg-[#faf9f6] flex items-center justify-center text-2xl mx-auto shadow-brutal-sm">
            🔒
          </div>
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase bg-[#fee2e2] text-red-950 border border-navy-900 px-2 py-0.5 rounded font-bold">
              AUTHENTICATION REQUIRED // RESTRICTED ACCESS
            </span>
            <h3 className="font-display font-bold text-xl text-navy-900 uppercase pt-1">
              Sign In to Access Security Archive
            </h3>
            <p className="text-xs text-grey-600 max-w-md mx-auto font-sans leading-relaxed">
              Historical scan replays, persistent timeline telemetry, and structured forensic JSON logs are reserved for authenticated accounts. Please sign in to verify your access.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={openAuth}
              className="px-5 py-2.5 bg-navy-900 text-white rounded font-bold text-xs hover:bg-navy-800 transition-colors shadow-brutal-sm uppercase inline-flex items-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>SIGN IN TO ACCESS ARCHIVE</span>
              <span>→</span>
            </button>
          </div>

          <p className="text-[11px] text-grey-500 font-sans">
            Guest access remains active for real-time Scanner, Certs, and Security modules.
          </p>
        </div>
      ) : (
        /* Logged in state: Pre-publication explanation */
        <div className="bg-white border-2 border-navy-900 rounded-lg p-12 text-center space-y-5 shadow-brutal font-mono">
          <div className="w-16 h-16 rounded-full border-2 border-navy-900 bg-[#f0f9ff] flex items-center justify-center text-2xl mx-auto shadow-brutal-sm">
            ⏳
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-[10px] uppercase bg-[#ffedd5] text-amber-950 border border-navy-900 px-2 py-0.5 rounded font-bold">
                PRE-RELEASE STAGE // LIVE DATA INACTIVE
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-navy-900 uppercase pt-1">
              No Archive Records Gathered Yet
            </h3>
            <p className="text-xs text-grey-600 max-w-lg mx-auto font-sans leading-relaxed">
              ThreatWho AI is currently operating in pre-publication preview. User historical audit data, cross-session telemetry, and persistent replay records will automatically begin gathering once the website is officially published live.
            </p>
          </div>

          <div className="bg-[#faf9f6] border border-navy-900/30 rounded p-4 max-w-md mx-auto text-left text-xs font-mono space-y-1.5 shadow-brutal-sm">
            <div className="flex items-center justify-between">
              <span className="text-grey-500 text-[10px] uppercase font-bold">Authenticated Identity:</span>
              <span className="font-bold text-navy-900">{user?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-grey-500 text-[10px] uppercase font-bold">Deployment Status:</span>
              <span className="text-amber-800 font-bold">Staged (Pre-Publication)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-grey-500 text-[10px] uppercase font-bold">Data Ingestion:</span>
              <span className="text-grey-600">Pending Public Launch</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
