'use client';

import { Info, AlertTriangle, Zap, Copy, Check } from 'lucide-react';
import { useState } from 'react';

function InlineCode({ children }: { children: string }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-900 text-xs font-mono text-gray-800 dark:text-gray-200">
      {children}
    </code>
  );
}

function CodeSnippet({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
      >
        {copied ? <Check size={12} className="text-teal-500" /> : <Copy size={12} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="overflow-auto p-4 text-sm font-mono text-gray-800 dark:text-gray-200 leading-relaxed">{code}</pre>
    </div>
  );
}

const PAYLOAD_EXAMPLE = JSON.stringify({
  event: 'sms.delivery_status',
  event_time: '2025-07-08T14:08:02+00:00',
  vendor: {
    id: 42,
    uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    email: 'vendor@example.com',
  },
  data: {
    sms_log_id: 19725260,
    status: 'delivered',
    recipient: '255712345678',
    sender_id: 'MYBRAND',
    transaction_id: '19725260',
    message_id: 'msg_abc123',
    message: 'Hello from RafikiSMS!',
    delivered_at: '2025-07-08T14:08:02+00:00',
    failure_reason: null,
    source_addr: 'MYBRAND',
    dest_addr: '255712345678',
    processing_time_ms: 1240,
    created_at: '2025-07-08T14:07:56+00:00',
    updated_at: '2025-07-08T14:08:02+00:00',
  },
}, null, 2);

const REGISTER_CURL = `curl -X PUT "https://api.rafikisms.com/v1/vendors/delivery-webhook" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"delivery_webhook_url": "https://yourapp.com/webhooks/sms"}'`;

const HANDLER_EXAMPLE = `// Express.js example
app.post('/webhooks/sms', express.json(), (req, res) => {
  // Respond immediately --- process async
  res.sendStatus(200);

  const { event, data } = req.body;
  if (event === 'sms.delivery_status') {
    console.log(\`SMS \${data.sms_log_id} -> \${data.status}\`);
    // Use data.sms_log_id as idempotency key
  }
});`;

const FIELDS = [
  ['event', 'string', 'Always "sms.delivery_status"'],
  ['event_time', 'ISO 8601', 'When the event was emitted by the server'],
  ['vendor.id', 'integer', 'Your vendor account ID'],
  ['vendor.email', 'string', 'Your vendor account email'],
  ['data.sms_log_id', 'integer', 'Internal SMS log ID --- use as idempotency key'],
  ['data.status', 'string', '"delivered" | "pending" | "failed" | "undelivered"'],
  ['data.recipient', 'string', 'Destination phone number'],
  ['data.sender_id', 'string', 'Sender name used for this message'],
  ['data.transaction_id', 'string', 'Carrier/gateway transaction reference'],
  ['data.message', 'string', 'The SMS text content'],
  ['data.delivered_at', 'ISO 8601 | null', 'Confirmed delivery timestamp, or null'],
  ['data.failure_reason', 'string | null', 'Reason for failure if status is failed'],
  ['data.processing_time_ms', 'integer', 'End-to-end processing time in milliseconds'],
];

export default function WebhooksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-3">Webhooks</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          RafikiSMS pushes real-time delivery status events to a URL you control.
          Configure your endpoint once and receive a POST every time an SMS delivery status changes.
        </p>
      </div>

      {/* How it works */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={18} className="text-teal-600 dark:text-teal-400" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">How It Works</h2>
        </div>
        <ol className="list-decimal ml-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Register your HTTPS endpoint URL in <strong className="text-gray-800 dark:text-gray-200">Profile -&gt; Integration -&gt; Delivery Webhook</strong> in the dashboard, or via the API below.</li>
          <li>When an SMS delivery status changes, RafikiSMS POSTs a JSON payload to your URL.</li>
          <li>Your endpoint must respond <InlineCode>2xx</InlineCode> within <strong className="text-gray-800 dark:text-gray-200">8 seconds</strong>.</li>
          <li>Non-2xx or timeout triggers automatic retries up to <strong className="text-gray-800 dark:text-gray-200">5 times</strong> with exponential backoff.</li>
        </ol>
      </section>

      {/* Registering */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Registering Your URL</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Send a <InlineCode>PUT</InlineCode> request to <InlineCode>/v1/vendors/delivery-webhook</InlineCode> with a Bearer access token. Only the parent vendor account can set this --- sub-accounts inherit it. Pass <InlineCode>null</InlineCode> to disable.
        </p>
        <CodeSnippet code={REGISTER_CURL} />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          On success the API responds <InlineCode>200</InlineCode> with <InlineCode>{`{"delivery_webhook_url": "..."}`}</InlineCode>.
        </p>
      </section>

      {/* Payload */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Event Payload</h2>
        <p className="text-gray-600 dark:text-gray-400">
          RafikiSMS sends <InlineCode>Content-Type: application/json</InlineCode>:
        </p>
        <CodeSnippet code={PAYLOAD_EXAMPLE} />

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pt-2">Field Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">Field</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                <th className="text-left py-2 font-semibold text-gray-700 dark:text-gray-300">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {FIELDS.map(([field, type, desc]) => (
                <tr key={field}>
                  <td className="py-2.5 pr-4 align-top">
                    <InlineCode>{field}</InlineCode>
                  </td>
                  <td className="py-2.5 pr-4 align-top text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{type}</td>
                  <td className="py-2.5 text-gray-600 dark:text-gray-400">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Handling example */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Handling Webhooks</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Always respond <InlineCode>200</InlineCode> immediately, then process asynchronously to avoid timeouts:
        </p>
        <CodeSnippet code={HANDLER_EXAMPLE} />
      </section>

      {/* Retry policy */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Retry Policy</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Non-2xx responses and timeouts trigger retries. Only <InlineCode>5xx</InlineCode> and <InlineCode>429</InlineCode> are retried --- <InlineCode>4xx</InlineCode> is treated as permanent and not retried.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-6 font-semibold text-gray-700 dark:text-gray-300">Attempt</th>
                <th className="text-left py-2 font-semibold text-gray-700 dark:text-gray-300">Delay (approx.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-600 dark:text-gray-400">
              {[['1st retry','~10 s'],['2nd retry','~30 s'],['3rd retry','~2 min'],['4th retry','~5 min'],['5th (final)','no further retries']].map(([a,d]) => (
                <tr key={a}><td className="py-2.5 pr-6">{a}</td><td className="py-2.5">{d}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Delays include up to 25% random jitter to spread load.
        </p>
      </section>

      {/* Circuit breaker */}
      <div className="flex gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
        <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-semibold">Circuit Breaker</p>
          <p>
            If your endpoint repeatedly fails, a circuit breaker temporarily pauses delivery to that URL to protect your server.
            Webhooks resume automatically once the circuit resets. Make sure your endpoint responds within 8 seconds.
          </p>
        </div>
      </div>

      {/* Best practices */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={18} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Best Practices</h2>
        </div>
        <ul className="list-disc ml-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Return <InlineCode>200</InlineCode> immediately, then handle the payload in a background job or queue.</li>
          <li>Use <InlineCode>data.sms_log_id</InlineCode> as an idempotency key --- the same event may arrive more than once.</li>
          <li>Your URL must use <strong className="text-gray-800 dark:text-gray-200">HTTPS</strong>.</li>
          <li>Log all incoming payloads before processing so you can replay events if needed.</li>
          <li>Keep your handler fast --- offload any DB writes or API calls to a queue.</li>
        </ul>
      </section>
    </div>
  );
}
