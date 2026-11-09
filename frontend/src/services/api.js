import { generateMockScanResult, INITIAL_COMMUNITY_REPORTS } from './mockData';

const BASE_URL = 'http://localhost:8000';

let isBackendAvailable = null;
let savedReports = (() => {
  try {
    const raw = localStorage.getItem('threatwho_reports');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

export async function checkBackendStatus() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    isBackendAvailable = res.ok;
    return res.ok;
  } catch (err) {
    isBackendAvailable = false;
    return false;
  }
}

export async function scanUrl(url) {
  // Normalize URL
  let target = url.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = 'https://' + target;
  }

  // Try live backend first if available or unprobed
  if (isBackendAvailable !== false) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`${BASE_URL}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        isBackendAvailable = true;
        // Enrich backend data if needed with domain/details for rich UI display
        return enrichScanData(data, target);
      }
    } catch (err) {
      console.warn('Backend unavailable, falling back to client-side threat intelligence engine:', err.message);
      isBackendAvailable = false;
    }
  }

  // Fallback to client-side threat analyzer engine
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = generateMockScanResult(target);
      resolve(result);
    }, 700);
  });
}

export async function getScanById(id) {
  if (isBackendAvailable) {
    try {
      const res = await fetch(`${BASE_URL}/api/scan/${id}`);
      if (res.ok) {
        const data = await res.json();
        return enrichScanData(data, data.url || 'https://example.com');
      }
    } catch (e) {
      console.error(e);
    }
  }
  // Try local storage
  const history = getSavedScanHistory();
  const match = history.find(s => s.id === id);
  if (match) return match;
  return null;
}

export async function submitThreatReport(report) {
  if (isBackendAvailable) {
    try {
      const res = await fetch(`${BASE_URL}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Fallback submit report:', err);
    }
  }

  // Local storage mock
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
    reportedAt: 'Just now'
  };
  savedReports = [newReport, ...savedReports];
  try {
    localStorage.setItem('threatwho_reports', JSON.stringify(savedReports));
  } catch (e) {
    console.error(e);
  }
  return { report_id: newReport.id, message: 'Threat report successfully submitted for community verification' };
}

export async function voteOnReport(reportId, voteType) {
  if (isBackendAvailable) {
    try {
      const res = await fetch(`${BASE_URL}/api/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_id: reportId, vote: voteType })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Fallback voting:', e);
    }
  }

  // Local update
  savedReports = savedReports.map(r => {
    if (r.id === reportId) {
      return {
        ...r,
        upvotes: voteType === 'up' ? r.upvotes + 1 : r.upvotes,
        downvotes: voteType === 'down' ? r.downvotes + 1 : r.downvotes,
      };
    }
    return r;
  });

  const found = savedReports.find(r => r.id === reportId);
  return {
    report_id: reportId,
    upvotes: found ? found.upvotes : 1,
    downvotes: found ? found.downvotes : 0
  };
}

export function getCommunityReports() {
  return savedReports;
}

export async function getDomainIntel(domain) {
  const cleanDomain = domain.replace(/^https?:\/\//i, '').split('/')[0];
  if (isBackendAvailable) {
    try {
      const res = await fetch(`${BASE_URL}/api/intel/${cleanDomain}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Fallback intel:', e);
    }
  }

  // Simulated intel
  const mock = generateMockScanResult('https://' + cleanDomain);
  return {
    domain: cleanDomain,
    trust_score: mock.trust_score,
    verdict: mock.verdict,
    reports: mock.breakdown.threat_intel.reports,
    feeds_hit: mock.breakdown.threat_intel.feeds_hit,
    details: mock.breakdown.threat_intel.details,
    certificate_issuer: mock.breakdown.certificate.details?.issuer || 'Unknown',
    scanned_at: new Date().toISOString()
  };
}

export function saveScanToHistory(scan) {
  try {
    const list = getSavedScanHistory();
    const filtered = list.filter(item => item.id !== scan.id && item.url !== scan.url);
    const updated = [scan, ...filtered].slice(0, 30);
    localStorage.setItem('aegis_scan_history', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save scan history', e);
  }
}

export function getSavedScanHistory() {
  try {
    const raw = localStorage.getItem('aegis_scan_history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearScanHistory() {
  localStorage.removeItem('aegis_scan_history');
}

// Utility to ensure data conforms to openapi.yaml specification
function enrichScanData(backendData, url) {
  const domain = (url.replace(/https?:\/\//i, '').split('/')[0]).toLowerCase();
  
  // Fill any missing breakdown fields gracefully
  return {
    ...backendData,
    url: backendData.url || url,
    domain: domain,
    trust_score: backendData.trust_score ?? 50,
    verdict: backendData.verdict || (backendData.trust_score > 70 ? 'safe' : backendData.trust_score > 35 ? 'suspicious' : 'dangerous'),
    reasons: backendData.reasons || ['Scan completed via automated threat pipeline.'],
    breakdown: backendData.breakdown || {
      model: { score: 75, label: 'analyzed', confidence: 0.8 },
      certificate: { score: 70, issues: [] },
      web_security: { score: 65, issues: [] },
      threat_intel: { score: 80, reports: 0, feeds_hit: [] }
    }
  };
}
