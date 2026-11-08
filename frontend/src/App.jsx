import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import TopHeader from './components/TopHeader';
import NavigationDrawer from './components/NavigationDrawer';
import AuthModal from './components/AuthModal';
import ReportModal from './components/ReportModal';
import DetailDrawer from './components/DetailDrawer';

import ScannerView from './views/ScannerView';
import CertificateView from './views/CertificateView';
import WebSecurityView from './views/WebSecurityView';
import ThreatIntelView from './views/ThreatIntelView';
import DomainLookupView from './views/DomainLookupView';
import HistoryView from './views/HistoryView';

import { generateMockScanResult, PRESET_TARGETS } from './services/mockData';
import { checkBackendStatus } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('scanner');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Starts empty until the user enters a URL to audit
  const [activeScan, setActiveScan] = useState(null);

  // Slide-out forensic inspector drawer state
  const [detailDrawer, setDetailDrawer] = useState({
    isOpen: false,
    type: null,
  });

  // Report threat modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    checkBackendStatus().then((online) => setIsBackendOnline(online));

    const interval = setInterval(() => {
      checkBackendStatus().then((online) => setIsBackendOnline(online));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenDetail = (type) => {
    setDetailDrawer({
      isOpen: true,
      type,
    });
  };

  const handleCloseDetail = () => {
    setDetailDrawer({
      isOpen: false,
      type: null,
    });
  };

  const handleAnalyzeUrlFromOtherView = (url) => {
    const scan = generateMockScanResult(url);
    setActiveScan(scan);
    setCurrentView('scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'scanner':
        return (
          <ScannerView
            activeScan={activeScan}
            setActiveScan={setActiveScan}
            onOpenDetail={handleOpenDetail}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onNavigateTab={(tab) => setCurrentView(tab)}
          />
        );
      case 'certificate':
        return <CertificateView activeScan={activeScan} />;
      case 'security':
        return <WebSecurityView activeScan={activeScan} />;
      case 'intel':
        return (
          <ThreatIntelView
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onAnalyzeUrl={handleAnalyzeUrlFromOtherView}
          />
        );
      case 'domain':
        return <DomainLookupView onAnalyzeUrl={handleAnalyzeUrlFromOtherView} />;
      case 'history':
        return (
          <HistoryView
            onSelectScan={(scan) => {
              setActiveScan(scan);
              setCurrentView('scanner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#faf9f6] text-navy-900 flex flex-col font-sans selection:bg-navy-900 selection:text-white">
        {/* Top Header Grid (mijonju.com inspired) */}
        <TopHeader
          onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          isBackendOnline={isBackendOnline}
        />

        {/* Top Navigation Bar - Directly accessible at top for one-click tab switching */}
        <nav
          aria-label="Primary Navigation"
          className="border-b-2 border-navy-900 bg-white px-4 md:px-8 py-2.5 font-mono text-xs sticky top-14 md:top-16 z-20 flex flex-wrap items-center justify-between gap-3 shadow-sm select-none"
        >
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="text-[10px] text-grey-500 uppercase tracking-widest font-bold">
              NAVIGATION:
            </span>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs">
              {[
                { id: 'scanner', label: 'Scanner' },
                { id: 'certificate', label: 'Certs' },
                { id: 'security', label: 'Security' },
                { id: 'intel', label: 'Feeds' },
                { id: 'domain', label: 'Whois' },
                { id: 'history', label: 'Archive' },
              ].map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-2.5 py-1 transition-all flex items-center gap-1.5 rounded-sm ${
                      isActive
                        ? 'bg-navy-900 text-white font-bold border border-navy-900 shadow-brutal-sm'
                        : 'text-navy-900 hover:text-navy-700 underline underline-offset-4 decoration-grey-400 hover:decoration-navy-900 font-medium'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="text-[8px]">●</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] text-grey-500">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-navy-900 font-bold uppercase">{isBackendOnline ? 'API LIVE' : 'PASSIVE RADAR'}</span>
            </span>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-12 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>

        {/* Compartmentalized Editorial Grid Footer (Inspired by Image 1) */}
        <footer className="border-t-2 border-navy-900 bg-[#faf9f6] font-mono text-xs select-none">
          {/* Upper Footer Grid Cells */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-navy-900 border-b border-navy-900">
            {/* Cell 1: Reminder / Motto */}
            <div className="md:col-span-4 p-5 space-y-1 bg-white">
              <span className="text-[10px] text-grey-500 uppercase tracking-widest block font-bold">
                SECURITY REMINDER // CORE PRINCIPLE
              </span>
              <p className="font-bold text-navy-900 text-sm">
                IDEAS ARE CHEAP. EXECUTION IS EXPENSIVE.
              </p>
              <p className="text-[11px] text-grey-600">
                Passive intelligence is only as reliable as the cryptographic infrastructure behind it.
              </p>
            </div>

            {/* Cell 2: Platform Status */}
            <div className="md:col-span-5 p-5 space-y-1 bg-[#fffdfa]">
              <span className="text-[10px] text-grey-500 uppercase tracking-widest block font-bold">
                THREATWHO AI PLATFORM
              </span>
              <p className="text-xs text-navy-900 font-bold">
                AI-Powered Web Threat Detection & Digital Trust Intelligence
              </p>
              <p className="text-[11px] text-grey-600">
                Passive URL threat analysis, certificate authority validation, and collaborative security telemetry.
              </p>
            </div>

            {/* Cell 3: Quick Links & Back to Top Button */}
            <div className="md:col-span-3 p-5 flex flex-col justify-between bg-white">
              <div>
                <span className="text-[10px] text-grey-500 uppercase tracking-widest block font-bold mb-1">
                  NAVIGATION
                </span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <button onClick={() => setCurrentView('scanner')} className="underline hover:text-navy-700">Scanner</button>
                  <button onClick={() => setCurrentView('certificate')} className="underline hover:text-navy-700">Certs</button>
                  <button onClick={() => setCurrentView('security')} className="underline hover:text-navy-700">Security</button>
                  <button onClick={() => setCurrentView('intel')} className="underline hover:text-navy-700">Feeds</button>
                  <button onClick={() => setCurrentView('domain')} className="underline hover:text-navy-700">Whois</button>
                  <button onClick={() => setCurrentView('history')} className="underline hover:text-navy-700">Archive</button>
                </div>
              </div>

              {/* Back to top circle button (matching Image 1 bottom right) */}
              <div className="pt-3 flex justify-end">
                <button
                  onClick={scrollToTop}
                  className="w-8 h-8 rounded-full border border-navy-900 bg-white hover:bg-navy-900 hover:text-white transition-colors flex items-center justify-center font-bold text-sm shadow-brutal-sm"
                  title="Scroll to Top"
                >
                  ↑
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Strip */}
          <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-[10px] text-grey-600 gap-2 bg-[#f3f2ee]">
            <div>COLLECTING, CONNECTING, VERIFYING TRUST NETWORKS.</div>
            <div>THREATWHO AI • DIGITAL TRUST INTELLIGENCE</div>
          </div>
        </footer>

        {/* Slide-out Navigation Drawer (Triggered by MENU ☰) */}
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          currentView={currentView}
          onSelectView={setCurrentView}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          isBackendOnline={isBackendOnline}
        />

        {/* Slide-out Diagnostic Forensic Inspector Drawer */}
        <DetailDrawer
          isOpen={detailDrawer.isOpen}
          onClose={handleCloseDetail}
          detailType={detailDrawer.type}
          scanData={activeScan}
        />

        {/* Authentication Modal / Guest Interface */}
        <AuthModal />

        {/* Collaborative Threat Report Modal */}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          defaultUrl={activeScan?.url || ''}
          onReportSubmitted={() => {
            if (currentView === 'intel') {
              setCurrentView('scanner');
              setTimeout(() => setCurrentView('intel'), 50);
            }
          }}
        />
      </div>
    </AuthProvider>
  );
}
