import { generateMockScanResult } from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const SCAN_TIMEOUT_MS = 15000;
const HEALTH_TIMEOUT_MS = 2000;
const HISTORY_KEY = 'aegis_scan_history';
const REPORTS_KEY = 'threatwho_reports';

const GATEWAY_CATEGORIES = ['phishing', 'fake_payment', 'fake_recruitment', 'impersonation', 'malware', 'other'];
const CATEGORY_ALIASES = {
  credential_harvesting: 'phishing',
  banking_phishing: 'phishing',
  certificate_anomaly: 'other',
};

let isBackendAvailable = null;
let savedReports = loadSavedReports();

// Reads locally saved reports so the offline demo still has something to show.
function loadSavedReports() {
  try {
    const rawReports = localStorage.getItem(REPORTS_KEY);
    return rawReports ? JSON.parse(rawReports) : [];
  } catch {
    return [];
  }
}

// Stops a request from hanging forever by aborting it after a deadline.
async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timerId);
  }
}

// Turns a UI label like "Credential Harvesting" into a category the gateway accepts.
function toGatewayCategory(label) {
  const key = String(label).trim().toLowerCase().replace(/[\s/-]+/g, '_');
  const category = CATEGORY_ALIASES[key] || key;
  return GATEWAY_CATEGORIES.includes(category) ? category : 'other';
}

// The gateway wants 1 or -1, while the UI uses 'up' and 'down'.
function toGatewayVote(voteType) {
  return voteType === 'up' || voteType === 1 ? 1 : -1;
}

// Pulls the gateway's error message so the user sees the real reason for a failure.
async function readErrorMessage(response) {
  try {
    const body = await response.json();
    return body.error || body.detail || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

// Lets the nav pill show whether the live gateway is reachable.
export async function checkBackendStatus() {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/health`, { method: 'GET' }, HEALTH_TIMEOUT_MS);
    isBackendAvailable = response.ok;
  } catch {
    isBackendAvailable = false;
  }
  return isBackendAvailable;
}

// Adds https:// so users can type a bare domain.
function normalizeTarget(rawUrl) {
  const target = rawUrl.trim();
  return /^https?:\/\//i.test(target) ? target : `https://${target}`;
}

// Marks fake results so nobody mistakes the offline simulation for a real scan.
function buildDemoResult(target, reason) {
  return { ...generateMockScanResult(target), isDemo: true, demo_reason: reason };
}

// Fills gaps in the backend response so the UI never breaks on missing fields.
function enrichScanData(backendData, url) {
  const domain = url.replace(/https?:\/\//i, '').split('/')[0].toLowerCase();
  const trustScore = backendData.trust_score ?? 50;
  return {
    ...backendData,
    isDemo: false,
    url: backendData.url || url,
    domain,
    trust_score: trustScore,
    verdict: backendData.verdict || (trustScore >= 70 ? 'safe' : trustScore >= 40 ? 'suspicious' : 'dangerous'),
    reasons: backendData.reasons || ['Scan completed via automated threat pipeline.'],
  };
}

// Scans through the gateway; only falls back to the labelled demo engine if the gateway fails.
export async function scanUrl(url) {
  const target = normalizeTarget(url);
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: target }),
    }, SCAN_TIMEOUT_MS);
    if (!response.ok) return buildDemoResult(target, await readErrorMessage(response));
    isBackendAvailable = true;
    return enrichScanData(await response.json(), target);
  } catch (error) {
    isBackendAvailable = false;
    return buildDemoResult(target, 'Backend unreachable');
  }
}

// Reopens an older scan by id, from the backend first and local history second.
export async function getScanById(id) {
  if (isBackendAvailable) {
    try {
      const response = await fetch(`${BASE_URL}/api/scan/${id}`);
      if (response.ok) {
        const data = await response.json();
        return enrichScanData(data, data.url || 'https://example.com');
      }
    } catch (error) {
      console.error(error);
    }
  }
  return getSavedScanHistory().find((scan) => scan.id === id) || null;
}

// Saves a report locally when there is no backend, so the offline demo still works.
function saveReportLocally(report) {
  const newReport = {
    id: Date.now(),
    url: report.url,
    category: report.category,
    targetBrand: report.targetBrand || 'Generic / Unknown',
    comment: report.comment,
    reporter: report.reporter || 'Anonymous Guest',
    verifiedReporter: !!report.verifiedReporter,
    upvotes: 1,
    downvotes: 0,
    status: 'Pending Verification',
    reportedAt: 'Just now',
  };
  savedReports = [newReport, ...savedReports];
  localStorage.setItem(REPORTS_KEY, JSON.stringify(savedReports));
  return { report_id: newReport.id, message: 'Saved locally (demo mode)' };
}

// Sends the report to the gateway so it really lands in SQLite; throws on rejection.
export async function submitThreatReport(report) {
  if (!isBackendAvailable) return saveReportLocally(report);
  const response = await fetchWithTimeout(`${BASE_URL}/api/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: report.url,
      category: toGatewayCategory(report.category),
      comment: report.comment,
    }),
  }, SCAN_TIMEOUT_MS);
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
}

// Updates the vote counters in the local demo list.
function voteLocally(reportId, voteType) {
  savedReports = savedReports.map((report) => {
    if (report.id !== reportId) return report;
    return {
      ...report,
      upvotes: report.upvotes + (voteType === 'up' ? 1 : 0),
      downvotes: report.downvotes + (voteType === 'down' ? 1 : 0),
    };
  });
  const found = savedReports.find((report) => report.id === reportId);
  return { report_id: reportId, upvotes: found?.upvotes ?? 1, downvotes: found?.downvotes ?? 0 };
}

// Sends the vote as 1 or -1 to the gateway; throws if it is rejected.
export async function voteOnReport(reportId, voteType) {
  if (!isBackendAvailable) return voteLocally(reportId, voteType);
  const response = await fetchWithTimeout(`${BASE_URL}/api/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ report_id: reportId, vote: toGatewayVote(voteType) }),
  }, SCAN_TIMEOUT_MS);
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
}

export function getCommunityReports() {
  return savedReports;
}

// The gateway may send reports as a list or a number, and the UI wants a number.
function countReports(reports) {
  return Array.isArray(reports) ? reports.length : reports ?? 0;
}

// Fetches community data from the gateway, because only a scan can give score, verdict and issuer.
async function fetchGatewayIntel(cleanDomain) {
  const response = await fetchWithTimeout(`${BASE_URL}/api/intel/${encodeURIComponent(cleanDomain)}`, {}, SCAN_TIMEOUT_MS);
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
}

// Merges the gateway's community numbers with a fresh scan so the Scanner card has every field.
export async function getDomainIntel(domain) {
  const cleanDomain = domain.replace(/^https?:\/\//i, '').split('/')[0];
  const scan = await scanUrl(cleanDomain);
  const intel = isBackendAvailable ? await fetchGatewayIntel(cleanDomain).catch(() => ({})) : {};
  return {
    domain: cleanDomain,
    isDemo: scan.isDemo,
    trust_score: scan.trust_score,
    verdict: scan.verdict,
    reports: countReports(intel.reports ?? scan.breakdown?.threat_intel?.reports),
    upvotes: intel.upvotes ?? 0,
    downvotes: intel.downvotes ?? 0,
    feeds_hit: intel.feeds_hit ?? scan.breakdown?.threat_intel?.feeds_hit ?? [],
    details: scan.breakdown?.threat_intel?.details ?? {},
    certificate_issuer: scan.breakdown?.certificate?.details?.issuer || 'Unknown',
    scanned_at: scan.scanned_at || new Date().toISOString(),
  };
}

// Keeps the last 30 scans so users can reopen them.
export function saveScanToHistory(scan) {
  try {
    const others = getSavedScanHistory().filter((item) => item.id !== scan.id && item.url !== scan.url);
    localStorage.setItem(HISTORY_KEY, JSON.stringify([scan, ...others].slice(0, 30)));
  } catch (error) {
    console.error('Failed to save scan history', error);
  }
}

export function getSavedScanHistory() {
  try {
    const rawHistory = localStorage.getItem(HISTORY_KEY);
    return rawHistory ? JSON.parse(rawHistory) : [];
  } catch {
    return [];
  }
}

export function clearScanHistory() {
  localStorage.removeItem(HISTORY_KEY);
}