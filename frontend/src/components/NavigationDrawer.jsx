import React from 'react';
import {
  X,
  Search,
  KeyRound,
  FileCode2,
  Users,
  Globe2,
  History,
  AlertTriangle,
  LogIn,
  LogOut,
  ShieldCheck,
  UserCheck,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NavigationDrawer({
  isOpen,
  onClose,
  currentView,
  onSelectView,
  onOpenReportModal,
  isBackendOnline
}) {
  const { user, isGuest, openAuth, logout } = useAuth();

  const navItems = [
    {
      index: '01',
      id: 'scanner',
      title: 'Digital Trust Scanner',
      subtitle: 'Passive AI heuristics, lexical entropy & phishing detection',
      tag: 'CORE RADAR',
      icon: Search,
    },
    {
      index: '02',
      id: 'certificate',
      title: 'Certificate & CA Trust Inspector',
      subtitle: 'PKI validation, CT logs & eMudhra key incident defense',
      tag: 'INCIDENT ADVISORY',
      icon: KeyRound,
    },
    {
      index: '03',
      id: 'security',
      title: 'Web Application Security Posture',
      subtitle: 'Passive headers audit: HSTS, CSP, Framing & Cookie security',
      tag: 'NON-INTRUSIVE',
      icon: FileCode2,
    },
    {
      index: '04',
      id: 'intel',
      title: 'Collaborative Threat Intelligence',
      subtitle: 'Community reports, live blocklists & consensus voting',
      tag: 'COMMUNITY API',
      icon: Users,
    },
    {
      index: '05',
      id: 'domain',
      title: 'Domain & WHOIS Reconnaissance',
      subtitle: 'ICANN registrar identity, ASN telemetry & IP geolocation',
      tag: 'WHOIS INTEL',
      icon: Globe2,
    },
    {
      index: '06',
      id: 'history',
      title: 'Audit Logs & Replay Archive',
      subtitle: 'Review past evaluations, replay scan IDs & export reports',
      tag: 'OFFLINE ARCHIVE',
      icon: History,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-none transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#faf9f6] border-l-2 border-navy-900 shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div>
            <div className="p-4 md:p-5 border-b border-navy-900 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-navy-900" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-navy-900">
                  Navigation Index // DIRECTORY
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 border border-navy-900 rounded bg-[#faf9f6] hover:bg-navy-900 hover:text-white transition-colors flex items-center gap-1 font-mono text-xs font-bold shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5"
              >
                <span>CLOSE</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Threat Report Action in Drawer */}
            <div className="p-4 bg-[#fff1f2] border-b border-navy-900 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="font-mono font-bold text-navy-900">Encountered a suspicious site?</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenReportModal();
                }}
                className="px-3 py-1 bg-red-600 text-white font-mono text-xs font-bold rounded border border-navy-900 hover:bg-red-700 transition-colors shadow-brutal-sm"
              >
                SUBMIT REPORT →
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="divide-y divide-navy-900/10 overflow-y-auto max-h-[calc(100vh-280px)]">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectView(item.id);
                      onClose();
                    }}
                    className={`w-full text-left p-4 md:p-5 transition-colors flex items-start gap-4 group ${
                      isActive
                        ? 'bg-navy-900 text-white'
                        : 'hover:bg-white text-navy-900'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs font-bold pt-1 ${
                        isActive ? 'text-amber-300' : 'text-grey-400 group-hover:text-navy-900'
                      }`}
                    >
                      {item.index}
                    </span>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-bold text-base md:text-lg tracking-tight leading-tight">
                          {item.title}
                        </span>
                        <ArrowRight
                          className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                            isActive ? 'text-white' : 'text-navy-900'
                          }`}
                        />
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          isActive ? 'text-grey-300' : 'text-grey-600'
                        }`}
                      >
                        {item.subtitle}
                      </p>
                      <span
                        className={`inline-block mt-2 font-mono text-[9px] uppercase px-1.5 py-0.5 border rounded ${
                          isActive
                            ? 'border-white/30 text-grey-200 bg-white/10'
                            : 'border-navy-900/30 text-navy-900 bg-paper-200'
                        }`}
                      >
                        {item.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Drawer Footer: Guest Account & Engine Info */}
          <div className="p-4 md:p-5 border-t border-navy-900 bg-white space-y-3 font-mono text-xs">
            {/* Guest / Account Pill */}
            {user ? (
              <div className="p-3 bg-[#faf9f6] border border-navy-900 rounded flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-navy-900 text-white flex items-center justify-center font-bold">
                    {user.avatar || 'U'}
                  </div>
                  <div>
                    <span className="font-bold text-navy-900 block leading-tight">{user.name}</span>
                    <span className="text-[10px] text-grey-500">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="px-2 py-1 text-[10px] text-red-700 hover:bg-red-50 rounded border border-red-200 transition-colors"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="p-3 bg-[#f0f9ff] border border-navy-900 rounded space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-navy-900 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-navy-800" />
                    <span>Guest Mode Active</span>
                  </span>
                  <span className="text-emerald-700 font-bold uppercase text-[9px] bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded">
                    100% Unrestricted
                  </span>
                </div>
                <p className="text-[10px] text-grey-600 leading-normal">
                  You do not have to log in to scan URLs, verify certificates, or query threat intelligence.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    openAuth();
                  }}
                  className="w-full py-1.5 px-3 bg-navy-900 text-white rounded font-bold text-[10px] hover:bg-navy-800 transition-colors shadow-brutal-sm flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3 h-3" />
                  <span>SIGN IN AS ANALYST (OPTIONAL)</span>
                </button>
              </div>
            )}

            {/* Micro Metadata */}
            <div className="flex items-center justify-between text-[10px] text-grey-500 pt-1">
              <span>ENGINE: {isBackendOnline ? 'FASTAPI 8000 LIVE' : 'CLIENT-SIDE RUNTIME'}</span>
              <span>THREATWHO AI • VER 2.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
