// Realistic threat intelligence dataset grounded in the problem statement
// Covers phishing, credential harvesting, fake recruitment, and CA trust/cryptographic weaknesses (eMudhra incident)

export const PRESET_TARGETS = [
  {
    name: 'Chase Bank Impersonation (Phishing)',
    url: 'https://secure-login.chase-auth-verification.com/ebank/signin',
    category: 'Banking Phishing',
    expectedScore: 12,
    verdict: 'dangerous',
    description: 'Deceptive domain mimicking Chase bank credentials harvesting portal with fresh domain and punycode obfuscation.'
  },
  {
    name: 'Fake Tech Recruitment Portal',
    url: 'https://careers-google-global-portal.net/jobs/security-engineer',
    category: 'Fake Recruitment',
    expectedScore: 42,
    verdict: 'suspicious',
    description: 'Impersonates multinational corporate hiring page, collects identity documents and banking details.'
  },
  {
    name: 'Cryptographic CA Weakness (eMudhra Incident Replica)',
    url: 'https://verify-efiling.in-taxservices.org/portal',
    category: 'Certificate Anomaly',
    expectedScore: 35,
    verdict: 'suspicious',
    description: 'TLS certificate exhibiting weak key entropy and compromised CA trust chain characteristics.'
  },
  {
    name: 'Legitimate Global Platform (GitHub)',
    url: 'https://github.com/login',
    category: 'Verified Safe',
    expectedScore: 97,
    verdict: 'safe',
    description: 'DigiCert High Assurance EV TLS, preloaded HSTS, multi-layer CSP, active Certificate Transparency.'
  },
  {
    name: 'Legitimate Financial Entity (Stripe)',
    url: 'https://dashboard.stripe.com/login',
    category: 'Verified Safe',
    expectedScore: 99,
    verdict: 'safe',
    description: 'Strict security headers, hardened cookie policies, established domain age, zero feed detections.'
  }
];

export const INITIAL_COMMUNITY_REPORTS = [];

export function generateMockScanResult(targetUrl) {
  const urlLower = targetUrl.toLowerCase();
  const domain = (targetUrl.replace(/https?:\/\//i, '').split('/')[0]).toLowerCase();
  const id = 'scan_' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();

  // 1. Phishing & Malicious detection logic
  const isSafeEntity = urlLower.includes('github.com') || 
                       urlLower.includes('stripe.com') || 
                       urlLower.includes('google.com') ||
                       urlLower.includes('microsoft.com') ||
                       urlLower.includes('apple.com');

  const isPhishing = urlLower.includes('chase') || 
                     urlLower.includes('paypal') || 
                     urlLower.includes('bank') || 
                     urlLower.includes('verify') || 
                     urlLower.includes('login-') || 
                     urlLower.includes('auth-');

  const isFakeJob = urlLower.includes('career') || 
                    urlLower.includes('hiring') || 
                    urlLower.includes('job');

  const isEmudhraIssue = urlLower.includes('tax') || 
                         urlLower.includes('emudhra') || 
                         urlLower.includes('in-tax');

  let trustScore = 78;
  let verdict = 'suspicious';
  let modelScore = 80;
  let certScore = 85;
  let secScore = 80;
  let intelScore = 75;
  let modelLabel = 'benign';
  let modelConf = 0.88;
  const reasons = [];

  if (isSafeEntity) {
    trustScore = 98;
    verdict = 'safe';
    modelScore = 99;
    certScore = 98;
    secScore = 96;
    intelScore = 99;
    modelLabel = 'legitimate';
    modelConf = 0.99;
    reasons.push('High-reputation top-level domain registered > 10 years');
    reasons.push('Valid EV/OV TLS certificate issued by trusted root CA');
    reasons.push('Strict HTTP Strict Transport Security (HSTS) with includeSubDomains');
    reasons.push('No malicious indicators found across OpenPhish, PhishTank, or URLhaus');
  } else if (isPhishing) {
    trustScore = 14;
    verdict = 'dangerous';
    modelScore = 10;
    certScore = 25;
    secScore = 18;
    intelScore = 8;
    modelLabel = 'phishing';
    modelConf = 0.96;
    reasons.push('High probability of financial institution brand impersonation');
    reasons.push('Domain registered less than 7 days ago via privacy-shielded registrar');
    reasons.push('Suspicious URL lexical structure with excessive subdomains and keywords');
    reasons.push('Subject Alternative Name (SAN) mismatch with legitimate target brand');
    reasons.push('Flagged by 4 collaborative threat intelligence community feeds');
  } else if (isEmudhraIssue) {
    trustScore = 38;
    verdict = 'suspicious';
    modelScore = 65;
    certScore = 20;
    secScore = 45;
    intelScore = 40;
    modelLabel = 'suspicious_crypto';
    modelConf = 0.82;
    reasons.push('Certificate matches compromised Certificate Authority key generation patterns');
    reasons.push('Weak cryptographic implementation: RSA modulus vulnerable to factorisation/entropy anomalies');
    reasons.push('Certificate Transparency (CT) log presence incomplete or delayed');
    reasons.push('Missing Content Security Policy (CSP) headers; clickjacking vulnerability');
  } else if (isFakeJob) {
    trustScore = 46;
    verdict = 'suspicious';
    modelScore = 40;
    certScore = 60;
    secScore = 45;
    intelScore = 38;
    modelLabel = 'fake_recruitment';
    modelConf = 0.89;
    reasons.push('Domain registration details obfuscated; recent TLD creation date');
    reasons.push('Credential and document harvesting scripts detected in page structure');
    reasons.push('Multiple user reports regarding unsolicited hiring outreach');
    reasons.push('Missing Subresource Integrity (SRI) on external JavaScript imports');
  } else {
    // Generic domain analysis
    trustScore = 65;
    verdict = 'suspicious';
    modelScore = 70;
    certScore = 75;
    secScore = 60;
    intelScore = 60;
    modelLabel = 'unknown_origin';
    modelConf = 0.72;
    reasons.push('Domain age under 90 days; limited trust reputation baseline');
    reasons.push('Standard Domain Validation (DV) certificate without organization validation');
    reasons.push('Content Security Policy missing frame-ancestors directive');
  }

  return {
    id,
    url: targetUrl,
    domain,
    trust_score: trustScore,
    verdict,
    reasons,
    scanned_at: now,
    breakdown: {
      model: {
        score: modelScore,
        label: modelLabel,
        confidence: modelConf,
        source: 'model',
        details: {
          url_length: targetUrl.length,
          subdomain_count: domain.split('.').length - 2,
          has_ip: /^\d+\.\d+\.\d+\.\d+$/.test(domain),
          entropy_score: (3.8 + Math.random() * 0.8).toFixed(2),
          keyword_flags: isPhishing ? ['login', 'verify', 'auth'] : isFakeJob ? ['career', 'jobs'] : [],
          brand_impersonation_risk: isPhishing ? 'Critical' : isFakeJob ? 'Moderate' : 'Low'
        }
      },
      certificate: {
        score: certScore,
        issues: certScore < 50 
          ? ['Weak key generation detected', 'Missing Certificate Transparency SCTs', 'Expiring in < 14 days']
          : certScore < 80 
            ? ['DV certificate only', 'No revocation status OCSP stapling']
            : ['Trust chain valid to root CA'],
        details: {
          issuer: isSafeEntity 
            ? 'DigiCert Global Root G2' 
            : isEmudhraIssue 
              ? 'eMudhra Sub-CA 2024 (Vulnerable Key Gen)' 
              : 'Let’s Encrypt DV Authority R3',
          subject: domain,
          valid_from: '2024-01-10T00:00:00Z',
          valid_to: isEmudhraIssue ? '2024-11-20T23:59:59Z' : '2027-10-15T23:59:59Z',
          days_left: isEmudhraIssue ? 12 : 680,
          cipher_suite: 'TLS_AES_256_GCM_SHA384 (ECDHE-RSA)',
          key_type: 'RSA 2048-bit',
          emudhra_flag: isEmudhraIssue,
          ct_logs_verified: !isEmudhraIssue,
          san_count: isPhishing ? 1 : 14
        }
      },
      web_security: {
        score: secScore,
        issues: secScore < 50
          ? ['Missing HSTS header', 'Missing Content-Security-Policy', 'X-Frame-Options disabled (Clickjacking risk)']
          : secScore < 85
            ? ['Missing strict Referrer-Policy', 'Cookies without SameSite=Strict']
            : ['All strict security headers configured'],
        details: {
          hsts_enabled: isSafeEntity,
          csp_configured: isSafeEntity,
          x_frame_options: isSafeEntity ? 'DENY' : 'NONE',
          cors_misconfiguration: !isSafeEntity && isPhishing,
          cookie_secure_flags: isSafeEntity ? 'Secure; HttpOnly; SameSite=Strict' : 'Missing HttpOnly',
          open_redirect_risk: isPhishing ? 'High' : 'Low',
          server_info_leakage: isPhishing ? 'Exposed (nginx/1.18.0)' : 'Obfuscated'
        }
      },
      threat_intel: {
        score: intelScore,
        reports: isPhishing ? 19 : isFakeJob ? 7 : isSafeEntity ? 0 : 2,
        feeds_hit: isPhishing 
          ? ['PhishTank #883921', 'OpenPhish Blacklist', 'URLhaus Confirmed', 'Google SafeBrowsing API']
          : isFakeJob
            ? ['Community Threat Report #102', 'ScamAdviser Low Trust']
            : [],
        details: {
          domain_age_days: isSafeEntity ? 5480 : isPhishing ? 4 : isFakeJob ? 9 : 140,
          registrar: isSafeEntity ? 'MarkMonitor Inc.' : 'NameCheap Privacy Protect / Tucows',
          ip_address: isSafeEntity ? '140.82.121.4' : '198.51.100.23',
          geolocation: isSafeEntity ? 'United States (San Francisco)' : 'Seychelles / Off-shore Proxy',
          autonomous_system: isSafeEntity ? 'AS36459 GitHub, Inc.' : 'AS4837 FastFlux Network',
          community_trust_score: intelScore
        }
      }
    }
  };
}
