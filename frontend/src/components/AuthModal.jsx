import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Lock, Mail, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthOpen, closeAuth, login, user, logout } = useAuth();
  const [tab, setTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Threat Intelligence Analyst');

  if (!isAuthOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    login(email, role, name || email.split('@')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-none transition-opacity"
        onClick={closeAuth}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#faf9f6] border-2 border-navy-900 rounded-lg max-w-md w-full shadow-brutal-lg overflow-hidden z-10 flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="p-4 border-b border-navy-900 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
              🛡
            </span>
            <span className="font-bold text-navy-900 uppercase tracking-tight text-sm">
              Identity & Access Management
            </span>
          </div>
          <button
            onClick={closeAuth}
            className="p-1 border border-navy-900 rounded bg-[#faf9f6] hover:bg-navy-900 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Guest Mode Assurance Banner */}
        <div className="bg-[#f0f9ff] border-b border-navy-900 p-3.5 text-navy-900 flex items-start gap-2.5">
          <UserCheck className="w-4 h-4 text-navy-900 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block uppercase text-[11px]">Optional Authentication (Guest Mode Active)</strong>
            <span className="font-sans text-[11px] text-grey-700">
              You are completely free to use all scanning, certificate validation, and threat feeds without logging in.
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {user ? (
            /* Logged In View */
            <div className="text-center py-2 space-y-4">
              <div className="w-16 h-16 rounded-full bg-navy-900 text-white flex items-center justify-center text-2xl font-bold font-display mx-auto border-2 border-navy-900 shadow-brutal-sm">
                {user.avatar || 'U'}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-navy-900">{user.name}</h3>
                <p className="text-xs text-grey-500">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-[#dcfce7] text-emerald-950 border border-navy-900">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{user.role}</span>
                </div>
              </div>

              <div className="bg-white border border-navy-900 p-3 rounded text-left text-xs space-y-1 text-grey-700 shadow-brutal-sm">
                <div className="flex justify-between">
                  <span>Community Credibility Score:</span>
                  <span className="font-bold text-navy-900">{user.reputationScore} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span>Submission Authority:</span>
                  <span className="text-navy-900 font-bold">Verified Contributor</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeAuth();
                  }}
                  className="flex-1 py-2 px-3 border border-navy-900 rounded font-bold text-xs text-navy-900 hover:bg-[#fee2e2] transition-colors"
                >
                  SWITCH TO GUEST
                </button>
                <button
                  type="button"
                  onClick={closeAuth}
                  className="flex-1 py-2 px-3 bg-navy-900 text-white rounded font-bold text-xs hover:bg-navy-800 transition-colors shadow-brutal-sm"
                >
                  RETURN TO RADAR
                </button>
              </div>
            </div>
          ) : (
            /* Unauthenticated View: Sign In / Register Tabs */
            <div>
              {/* Tab Selector */}
              <div className="flex border-b border-navy-900 mb-5">
                <button
                  onClick={() => setTab('signin')}
                  className={`pb-2.5 text-xs font-bold uppercase px-4 border-b-2 transition-colors ${
                    tab === 'signin'
                      ? 'border-navy-900 text-navy-900'
                      : 'border-transparent text-grey-400 hover:text-navy-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setTab('register')}
                  className={`pb-2.5 text-xs font-bold uppercase px-4 border-b-2 transition-colors ${
                    tab === 'register'
                      ? 'border-navy-900 text-navy-900'
                      : 'border-transparent text-grey-400 hover:text-navy-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {tab === 'register' && (
                  <div>
                    <label className="block text-[11px] font-bold text-navy-900 uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Chen"
                      className="w-full px-3 py-2 border border-navy-900 rounded text-xs text-navy-900 bg-white focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-navy-900 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@domain.com"
                    className="w-full px-3 py-2 border border-navy-900 rounded text-xs text-navy-900 bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy-900 uppercase mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 border border-navy-900 rounded text-xs text-navy-900 bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-navy-900 text-white rounded font-bold text-xs hover:bg-navy-800 transition-colors shadow-brutal-sm flex items-center justify-center gap-2 mt-4 uppercase"
                >
                  <span>{tab === 'signin' ? 'Sign In' : 'Create Free Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Guest dismissal */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={closeAuth}
                  className="text-[11px] text-grey-500 hover:text-navy-900 underline"
                >
                  Continue browsing as Guest without signing in →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
