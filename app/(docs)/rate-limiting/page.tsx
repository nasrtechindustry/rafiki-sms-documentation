import { AlertTriangle } from 'lucide-react';

export default function RateLimitingPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Rate Limiting</h1>

      <div className="flex gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
        <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300">
          If you exceed the rate limit, you will receive a <code className="text-xs font-mono">429 Too Many Requests</code> response.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          The RafikiSMS API enforces rate limits to prevent abuse and ensure fair usage. Limits are applied per API key or access token.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Default Rate Limits</h2>
        <ul className="list-disc ml-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Authenticated requests:</strong> 60 requests per minute per token</li>
          <li><strong>API Key requests:</strong> 60 requests per minute per API key</li>
          <li><strong>OTP Generate:</strong> 3 requests per phone number per 5 minutes</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Rate Limit Headers</h2>
        <p className="text-gray-600 dark:text-gray-400">Every API response includes headers indicating your current rate limit status:</p>
        <ul className="list-disc ml-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li><code className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">X-RateLimit-Limit</code> --- maximum requests allowed</li>
          <li><code className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">X-RateLimit-Remaining</code> --- requests remaining in current window</li>
          <li><code className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">X-RateLimit-Reset</code> --- Unix timestamp when window resets</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Handling Rate Limits</h2>
        <p className="text-gray-600 dark:text-gray-400">When you receive a 429 response:</p>
        <ol className="list-decimal ml-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Wait for the rate limit window to reset (check <code className="text-xs font-mono">X-RateLimit-Reset</code>)</li>
          <li>Implement exponential backoff in your application</li>
          <li>Consider caching responses to reduce API calls</li>
          <li>Contact support if you need higher rate limits</li>
        </ol>
      </section>
    </div>
  );
}
