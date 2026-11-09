import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  Download,
  ExternalLink,
  Search,
  Calendar,
  ShieldCheck,
  Printer
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { getSavedScanHistory, clearScanHistory } from '../services/api';

export default function HistoryView({ onSelectScan }) {
  const [history, setHistory] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    setHistory(getSavedScanHistory());
  }, []);

  const handleClear = () => {
    if (window.confirm('Clear all stored audit records from local storage?')) {
      clearScanHistory();
      setHistory([]);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `threatwho_ai_audit_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filtered = history.filter((s) => {
    return (
      s.url?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.verdict?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.id?.toLowerCase().includes(filterQuery.toLowerCase())
    );
  });

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
            Reopen previous evaluations, export structured machine-readable JSON forensic records, or review timeline security regressions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportJSON}
                className="px-3.5 py-2 border border-navy-900 text-navy-900 bg-white rounded text-xs font-bold hover:bg-[#faf9f6] transition-colors shadow-brutal-sm flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>EXPORT JSON</span>
              </button>
              <button
                onClick={handleClear}
                className="px-3.5 py-2 border border-navy-900 text-red-900 bg-[#fee2e2] rounded text-xs font-bold hover:bg-red-200 transition-colors shadow-brutal-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>CLEAR</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search Input */}
      {history.length > 0 && (
        <div className="bg-white border-2 border-navy-900 rounded-lg p-4 shadow-brutal-sm font-mono text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-grey-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter audits by URL, verdict, or scan ID..."
              className="w-full pl-9 pr-3 py-2 border border-navy-900 rounded text-xs text-navy-900 bg-[#faf9f6] focus:outline-none focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* History List */}
      {filtered.length === 0 ? (
        <div className="bg-white border-2 border-navy-900 rounded-lg p-12 text-center space-y-3 shadow-brutal font-mono">
          <span className="text-3xl block">📁</span>
          <h3 className="font-display font-bold text-lg text-navy-900 uppercase">No Prior Audit Records Found</h3>
          <p className="text-xs text-grey-600 max-w-sm mx-auto font-sans">
            Run an analysis from the Digital Trust Scanner. Audits will automatically be recorded here for instant replay and compliance export.
          </p>
        </div>
      ) : (
        <div className="space-y-3 font-mono text-xs">
          {filtered.map((scan) => (
            <div
              key={scan.id}
              onClick={() => onSelectScan(scan)}
              className="bg-white border-2 border-navy-900 rounded-lg p-4 hover:shadow-brutal cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={scan.verdict} size="sm" />
                  <span className="font-bold text-grey-600">ID: {scan.id}</span>
                  <span className="text-grey-400">•</span>
                  <span className="text-grey-500">
                    {new Date(scan.scanned_at || Date.now()).toLocaleString()}
                  </span>
                </div>
                <div className="font-bold text-sm text-navy-900 break-all font-mono">
                  {scan.url}
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[9px] uppercase text-grey-400 block font-bold">Trust Score</span>
                  <span className="text-2xl font-display font-bold text-navy-900">
                    {scan.trust_score}/100
                  </span>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-navy-900 text-white rounded text-xs font-bold transition-colors shadow-brutal-sm flex items-center gap-1 uppercase"
                >
                  <span>Replay</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
