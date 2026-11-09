const maxUrlLength = 2048;
const maxCommentLength = 500;
const allowedCategories = [
  "phishing", "fake_payment", "fake_recruitment", "impersonation", "malware", "other",
];

// Makes "WWW.Example.com." and "example.com" count as the same domain everywhere.
function normalizeDomain(rawDomain) {
  if (typeof rawDomain !== "string") return null;
  const cleanDomain = rawDomain.trim().toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
  const looksLikeDomain = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(cleanDomain);
  const isTooLong = cleanDomain.length > 253;
  return looksLikeDomain && !isTooLong ? cleanDomain : null;
}

// Adds http:// when the user typed a bare domain like "fake-bank.com".
function addMissingScheme(rawUrl) {
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(rawUrl);
  return hasScheme ? rawUrl : `http://${rawUrl}`;
}

// Turns messy user input into a clean url and domain, or null if it is junk.
function parseUrl(rawUrl) {
  if (typeof rawUrl !== "string" || rawUrl.length > maxUrlLength) return null;
  try {
    const parsedUrl = new URL(addMissingScheme(rawUrl.trim()));
    const isWebAddress = parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    const domain = normalizeDomain(parsedUrl.hostname);
    if (!isWebAddress || !domain) return null;
    const cleanUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}${parsedUrl.search}`;
    return { url: cleanUrl, domain };
  } catch {
    return null;
  }
}

// Removes hidden control characters and limits length so comments stay safe to store.
function cleanComment(rawComment) {
  if (typeof rawComment !== "string") return null;
  const withoutControlChars = rawComment.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
  return withoutControlChars.slice(0, maxCommentLength) || null;
}

module.exports = { allowedCategories, normalizeDomain, parseUrl, cleanComment };