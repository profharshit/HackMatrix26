import React from 'react';
import finderVideo from '../assets/finder.mp4';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopHeader({
  onToggleDrawer,
  onOpenReportModal,
  isBackendOnline
}) {
  const { user, isGuest, openAuth } = useAuth();

  return (
    <header className="w-full bg-[#faf9f6] border-b border-navy-900 sticky top-0 z-30 font-mono text-xs select-none">
      <div className="flex items-stretch justify-between h-14 md:h-16 divide-x divide-navy-900">
        {/* Cell 1: Brand & Logo */}
        <div className="flex items-center px-4 md:px-6 gap-2.5">
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

        {/* Right Section: Guest Access Status & Auth + Finder Video + MENU */}
        <div className="flex items-stretch divide-x divide-navy-900">
          {/* Guest Access Status */}
          <div className="hidden sm:flex items-center px-4 md:px-6">
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
          </div>

          {/* Action Area: Sign In Button + Report Threat Video + MENU Drawer Trigger */}
          <div className="flex items-center px-3 md:px-4 gap-2.5 sm:gap-3">
            <button
              onClick={openAuth}
              className="text-[10px] sm:text-[11px] font-bold uppercase underline hover:text-navy-700 transition-colors"
            >
              {isGuest ? 'Sign in' : 'Profile'}
            </button>

            <button
              onClick={onOpenReportModal}
              className="flex items-center justify-center p-0.5 hover:scale-105 active:scale-95 transition-transform"
              title="Report Threat URL"
              aria-label="Report Threat URL"
            >
              <video
                src={finderVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain rounded pointer-events-none"
              />
            </button>

            {/* Editorial Pill MENU Button ("MENU ☰") */}
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
      </div>
    </header>
  );
}
