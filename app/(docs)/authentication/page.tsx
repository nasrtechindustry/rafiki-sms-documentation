export default function AuthenticationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-3">Authentication</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          The RafikiSMS API uses API key authentication. Include your key in the{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">X-API-Key</code>{' '}
          header of every request.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">API Key Authentication</h2>
        <p className="text-gray-600 dark:text-gray-400">
          All API endpoints require an API key. Include it in the <code className="text-xs font-mono">X-API-Key</code> header:
        </p>
        <div className="rounded-lg bg-gray-100 dark:bg-gray-900 px-4 py-3 font-mono text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
          X-API-Key: sk_your_api_key_here
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pt-2">How to get your API key</h3>
        <ol className="list-decimal ml-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Log in to your vendor account</li>
          <li>Navigate to <strong className="text-gray-800 dark:text-gray-200">Profile -&gt; Integration</strong> tab</li>
          <li>Click <strong className="text-gray-800 dark:text-gray-200">"Generate New Key"</strong> to create an API key</li>
          <li>Copy and save your API key securely --- it won't be shown again</li>
        </ol>
        <div className="mt-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-3">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Security:</strong> Keep your API key secret. Never expose it in client-side code, public repositories, or browser JavaScript.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Using Your API Key</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Once you have your key, pass it in the <code className="text-xs font-mono">X-API-Key</code> header for every request:
        </p>
        <div className="rounded-lg bg-gray-100 dark:bg-gray-900 px-4 py-3 font-mono text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 whitespace-pre">{`curl -X GET "https://api.rafikisms.com/v1/vendor/sender-names" \\
  -H "Accept: application/json" \\
  -H "X-API-Key: sk_your_api_key_here"`}</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          An invalid or missing API key returns a <code className="text-xs font-mono">401 Unauthorized</code> response.
        </p>
      </section>
    </div>
  );
}
