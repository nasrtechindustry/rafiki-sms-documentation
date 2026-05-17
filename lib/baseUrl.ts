const FALLBACK = 'https://api.rafikisms.com';

export function resolveBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // On a real deployment derive the API host from the docs host
    if (hostname && !hostname.startsWith('localhost') && !hostname.startsWith('127.')) {
      const apiHostname = hostname.replace(/^(www\.|developers\.)?/, 'api.');
      return `${window.location.protocol}//${apiHostname}`;
    }
  }
  // Always use the real API URL in dev/localhost — never the docs app origin
  return FALLBACK;
}
