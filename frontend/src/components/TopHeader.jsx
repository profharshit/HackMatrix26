import React from 'react';
import { ShieldCheck, Menu, UserCheck, LogIn, User, Sparkles, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopHeader({
  onToggleDrawer,
  onOpenReportModal,
  isBackendOnline
}) {
  const { user, isGuest, openAuth } = useAuth();

  return (
    <header className="w-full bg-[#faf9f6] border-b border-navy-900 sticky top-0 z-30 font-mono text-xs select-none">
      <div className="grid grid-cols-12 items-stretch h-14 md:h-16">
        {/* Cell 1: Brand & Logo (Cols 1-4 on mobile, 1-3 on desktop) */}
        <div className="col-span-5 md:col-span-3 border-r border-navy-900 flex items-center px-4 md:px-6 gap-2.5">
          <div className="w-7 h-7 bg-navy-900 text-white rounded flex items-center justify-center font-bold font-display text-sm shadow-brutal-sm">
            🛡
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm md:text-base text-navy-900 tracking-tight leading-none">
              threatwho<span className="text-xs text-grey-500 font-mono">.ai</span>
            </span>
            <span className="text-[9px] text-grey-500 tracking-widest uppercase">
              Digital Trust Intelligence
            </span>
          </div>
        </div>

        {/* Cell 2: Mission / Tagline (Hidden on mobile) */}
        <div className="hidden lg:flex col-span-3 border-r border-navy-900 items-center px-4 justify-between leading-tight text-[11px] text-grey-700">
          <div>
            <span className="font-bold text-navy-900 block uppercase">Passive Web Threat Radar</span>
            <span className="text-grey-500 text-[10px]">Zero Port Probing • Non-Intrusive</span>
          </div>
          <span className="text-xs">🌐</span>
        </div>

        {/* Cell 3: Engine Version & Status (Hidden on smaller screens) */}
        <div className="hidden md:flex col-span-3 lg:col-span-2 border-r border-navy-900 items-center px-4 justify-between text-[11px]">
          <div>
            <span className="text-grey-500 block text-[9px] uppercase">Engine Status</span>
            <span className={`font-bold flex items-center gap-1.5 ${isBackendOnline ? 'text-emerald-700' : 'text-navy-900'}`}>
              <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-500' : 'bg-navy-900'}`} />
              {isBackendOnline ? 'v0.1.0 API Live' : 'Heuristic Mode'}
            </span>
          </div>
          <span className="text-[10px] text-grey-400">v0.1</span>
        </div>

        {/* Cell 4: Guest Access Status & Auth Pill (Visible on tablet/desktop) */}
        <div className="hidden sm:flex col-span-3 lg:col-span-2 border-r border-navy-900 items-center px-4 justify-between">
          {isGuest ? (
            <div className="flex items-center gap-1.5 text-[11px] text-grey-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <div className="leading-tight">
                <span className="font-bold text-navy-900 block">Guest Active</span>
                <span className="text-[9px] text-grey-500">No login required</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-navy-900 truncate">
              <span className="w-5 h-5 rounded-full bg-navy-900 text-white flex items-center justify-center text-[10px] font-bold">
                {user.avatar || 'U'}
              </span>
              <span className="font-bold truncate text-[10px]">{user.name}</span>
            </div>
          )}

          <button
            onClick={openAuth}
            className="text-[10px] font-bold uppercase underline hover:text-navy-700 transition-colors"
          >
            {isGuest ? 'Sign in' : 'Profile'}
          </button>
        </div>

        {/* Cell 5: Report Threat & MENU Drawer Trigger (Cols 7-12 on mobile, last cols on desktop) */}
        <div className="col-span-7 sm:col-span-4 md:col-span-4 lg:col-span-2 flex items-center justify-end px-3 md:px-4 gap-2">
          <button
            onClick={onOpenReportModal}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-[#ffeedb] text-navy-900 border border-navy-900 rounded hover:shadow-brutal-sm transition-all"
            title="Report Threat URL"
          >
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span>REPORT</span>
          </button>

          {/* Editorial Pill MENU Button matching Image 1 ("MENU ☰") */}
          <button
            onClick={onToggleDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-navy-900 rounded-full font-bold text-xs hover:bg-navy-900 hover:text-white transition-all shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Open Navigation Drawer"
          >
            <span>MENU</span>
            <Menu className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
