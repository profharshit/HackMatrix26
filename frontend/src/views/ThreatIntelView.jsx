import React, { useState, useEffect } from 'react';
import {
  Users,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { getCommunityReports, voteOnReport } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ThreatIntelView({ onOpenReportModal, onAnalyzeUrl }) {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [votedMap, setVotedMap] = useState({});

  useEffect(() => {
    setReports(getCommunityReports());
  }, []);

  const handleVote = async (reportId, type) => {
    if (votedMap[reportId]) return;
    try {
      const res = await voteOnReport(reportId, type);
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, upvotes: res.upvotes, downvotes: res.downvotes }
            : r
        )
      );
      setVotedMap((prev) => ({ ...prev, [reportId]: type }));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesCat = filterCategory === 'all' || r.category === filterCategory;
    const matchesSearch =
      r.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.targetBrand && r.targetBrand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.comment && r.comment.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Banner */}
      <div className="bg-white border-2 border-navy-900 rounded-lg p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[10px] uppercase bg-[#bae6fd] text-blue-950 border border-navy-900 px-2 py-0.5 rounded font-bold">
              CROWDSOURCED DEFENSE NETWORK // COLLABORATIVE FEED
            </span>
            <span className="text-xs text-grey-500 font-mono">
              API: /api/report & /api/vote
            </span>
          </div>
          <h2 className="font-display font-bold text-2xl text-navy-900 tracking-tight uppercase">
            Collaborative Threat Intelligence Feed
          </h2>
          <p className="text-xs text-grey-700 mt-1 max-w-2xl leading-relaxed font-sans">
            Community-driven defense network where analysts submit and verify malicious domains, credential harvesting lures, and fake corporate portals in real time.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-4 py-2.5 bg-navy-900 text-white rounded font-mono text-xs font-bold hover:bg-navy-800 transition-colors flex items-center gap-2 self-start md:self-auto flex-shrink-0 shadow-brutal-sm uppercase"
        >
          <Plus className="w-4 h-4" />
          <span>Report Threat Endpoint →</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border-2 border-navy-900 rounded-lg p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-brutal-sm font-mono text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-grey-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reported domains, targeted brands, or threat keywords..."
            className="w-full pl-9 pr-3 py-2 border border-navy-900 rounded text-xs text-navy-900 bg-[#faf9f6] focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-grey-500 flex-shrink-0" />
          {['all', 'phishing', 'fake_recruitment', 'malware', 'scam'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase whitespace-nowrap transition-colors border border-navy-900 ${
                filterCategory === cat
                  ? 'bg-navy-900 text-white shadow-brutal-sm'
                  : 'bg-[#faf9f6] text-navy-900 hover:bg-white'
              }`}
            >
              {cat === 'all' ? 'All Threats' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4 font-mono text-xs">
        {filteredReports.length === 0 ? (
          <div className="bg-white border-2 border-navy-900 rounded-lg p-12 text-center space-y-4 shadow-brutal">
            <div className="w-12 h-12 rounded-full border-2 border-navy-900 bg-[#faf9f6] flex items-center justify-center text-xl mx-auto shadow-brutal-sm">
              🛡️
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-navy-900 uppercase">
                No Threat Reports Filed Yet
              </h3>
              <p className="text-xs text-grey-600 max-w-md mx-auto font-sans mt-1 leading-relaxed">
                The collaborative defense database currently has zero active threat reports filed. When community members or security analysts submit a suspicious domain via POST /api/report, it will appear here for verification.
              </p>
            </div>
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2 bg-navy-900 text-white rounded font-bold text-xs hover:bg-navy-800 transition-colors shadow-brutal-sm uppercase inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit the First Threat Report →</span>
            </button>
          </div>
        ) : (
          filteredReports.map((report) => {
            const userVote = votedMap[report.id];
            return (
              <div
                key={report.id}
                className="bg-white border-2 border-navy-900 rounded-lg p-5 hover:shadow-brutal transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={report.category} size="sm" />
                      {report.targetBrand && (
                        <span className="text-xs font-bold text-navy-900 bg-[#faf9f6] border border-navy-900 px-2 py-0.5 rounded">
                          Targeting: {report.targetBrand}
                        </span>
                      )}
                      <span className="text-xs text-grey-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {report.reportedAt}
                      </span>
                    </div>

                    <div className="font-mono text-sm font-bold text-navy-900 break-all">
                      {report.url}
                    </div>

                    <p className="text-xs text-grey-700 font-sans leading-relaxed">
                      {report.comment}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-grey-500 pt-1">
                      <span>Submitted by:</span>
                      <span className="font-bold text-navy-900">{report.reporter}</span>
                      {report.verifiedReporter && (
                        <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-[#dcfce7] border border-emerald-900 px-1.5 py-0.2 rounded text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          VERIFIED ANALYST
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: Run Scan & Community Voting */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-navy-900/10">
                    <button
                      onClick={() => onAnalyzeUrl(report.url)}
                      className="px-3 py-1.5 bg-[#faf9f6] text-navy-900 border border-navy-900 hover:bg-navy-900 hover:text-white rounded text-xs font-bold transition-colors shadow-brutal-sm flex items-center gap-1.5"
                    >
                      <span>Run Passive Scan</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-1 bg-[#faf9f6] border border-navy-900 rounded p-1 shadow-brutal-sm">
                      <button
                        onClick={() => handleVote(report.id, 'up')}
                        disabled={!!userVote}
                        className={`p-1.5 rounded text-xs flex items-center gap-1 font-bold transition-colors ${
                          userVote === 'up'
                            ? 'bg-[#dcfce7] text-emerald-950'
                            : 'text-grey-700 hover:text-navy-900 hover:bg-white'
                        }`}
                        title="Upvote (Confirm Threat)"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{report.upvotes}</span>
                      </button>

                      <span className="text-grey-400">|</span>

                      <button
                        onClick={() => handleVote(report.id, 'down')}
                        disabled={!!userVote}
                        className={`p-1.5 rounded text-xs flex items-center gap-1 font-bold transition-colors ${
                          userVote === 'down'
                            ? 'bg-[#fee2e2] text-red-950'
                            : 'text-grey-700 hover:text-navy-900 hover:bg-white'
                        }`}
                        title="Downvote (False Positive)"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>{report.downvotes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
