import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { submitThreatReport } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReportModal({ isOpen, onClose, defaultUrl = '', onReportSubmitted }) {
  const { user } = useAuth();
  const [url, setUrl] = useState(defaultUrl);
  const [category, setCategory] = useState('phishing');
  const [targetBrand, setTargetBrand] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsSubmitting(true);
    try {
      await submitThreatReport({
        url: url.trim(),
        category,
        targetBrand: targetBrand.trim() || undefined,
        comment: comment.trim(),
        reporter: user ? user.name : 'Anonymous Guest Analyst',
        verifiedReporter: !!user
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (onReportSubmitted) onReportSubmitted();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-none transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#faf9f6] border-2 border-navy-900 rounded-lg max-w-lg w-full shadow-brutal-lg overflow-hidden z-10 flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="p-4 border-b border-navy-900 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <div>
              <span className="font-bold text-navy-900 uppercase tracking-tight block text-sm">
                Submit Collaborative Threat Intelligence
              </span>
              <span className="text-[10px] text-grey-500 font-mono">
                Direct Feed Integration: POST /api/report
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-navy-900 rounded bg-[#faf9f6] hover:bg-navy-900 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3 bg-white">
            <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
            <h3 className="font-display font-bold text-lg text-navy-900">THREAT RECORD REGISTERED</h3>
            <p className="text-xs text-grey-600 max-w-sm mx-auto font-sans">
              Thank you for contributing to digital trust. Your submission has entered the community verification pool and is propagating to defense nodes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-navy-900 uppercase mb-1">
                Suspicious / Malicious URL *
              </label>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://malicious-login-portal.com/login"
                className="w-full px-3 py-2 border border-navy-900 rounded text-xs text-navy-900 bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-navy-900 uppercase mb-1">
                  Threat Classification *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-navy-900 rounded text-xs text-navy-900 bg-white focus:outline-none"
                >
                  <option value="phishing">Phishing / Credential Harvest</option>
                  <option value="fake_recruitment">Fake Recruitment Portal</option>
                  <option value="malware">Malware / Dropper</option>
                  <option value="scam">Fraud / Financial Scam</option>
                  <option value="other">Other / Certificate Anomaly</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-navy-900 uppercase mb-1">
                  Targeted Brand / Entity
                </label>
                <input
                  type="text"
                  value={targetBrand}
                  onChange={(e) => setTargetBrand(e.target.value)}
                  placeholder="e.g. JPMorgan Chase, Google"
                  className="w-full px-3 py-2 border border-navy-900 rounded text-xs text-navy-900 bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-navy-900 uppercase mb-1">
                Observations & Evidence Details
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Observed credential harvesting form fields, sender email headers, SMS pretext, or fake certificate details..."
                className="w-full px-3 py-2 border border-navy-900 rounded text-xs text-navy-900 bg-white focus:outline-none font-sans"
              />
            </div>

            <div className="bg-white border border-navy-900 p-3 rounded text-xs flex justify-between items-center shadow-brutal-sm">
              <span className="text-grey-600">Submitting as:</span>
              <span className="font-bold text-navy-900">
                {user ? `${user.name} (${user.role})` : 'Guest Analyst (Unverified)'}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-navy-900 rounded font-bold text-xs text-navy-900 hover:bg-[#faf9f6] transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-navy-900 text-white rounded font-bold text-xs hover:bg-navy-800 disabled:opacity-50 transition-colors shadow-brutal-sm flex items-center gap-1.5 uppercase"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Report →'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
