export default function ParametersPage() {
  const bodyParams = [
    {
      endpoint: 'All POST/PUT endpoints',
      params: [
        { name: 'phone', type: 'string', required: 'Yes', desc: 'Phone number in international format (e.g., 255712345678). Used in send-sms.' },
        { name: 'message', type: 'string', required: 'Yes', desc: 'SMS message content (max 160 characters). Used in send-sms and send-bulk-sms.' },
        { name: 'sender_id', type: 'string', required: 'No', desc: 'Approved sender name (max 11 chars). If omitted, the SMS uses the RafikiSMS default company sender name instead of your brand. Used in send-sms, send-bulk-sms, otp/generate.' },
        { name: 'recipients', type: 'array<string>', required: 'Yes', desc: 'Array of phone numbers for bulk SMS (e.g., ["255712345678","255621728109"]). Used in send-bulk-sms.' },
        { name: 'phone_number', type: 'string', required: 'Yes', desc: 'Destination number in E.164 format (e.g., 255712345678). Used in otp/generate, otp/verify.' },
        { name: 'otp_code', type: 'string', required: 'Yes', desc: 'The 6-digit code the user received via SMS. Used in otp/verify.' },
        { name: 'reference_id', type: 'uuid', required: 'Yes', desc: 'UUID returned by otp/generate. Used in otp/verify.' },
        { name: 'senderid', type: 'string', required: 'Yes', desc: 'Desired sender ID (max 11 chars, alphanumeric with spaces/hyphens/dots). Used in sender-names/request.' },
        { name: 'sample_content', type: 'string', required: 'Yes', desc: 'Sample message content (min 15 chars). Used in sender-names/request.' },
        { name: 'delivery_webhook_url', type: 'string (uri)', required: 'No', desc: 'HTTPS URL for delivery status callbacks. Pass null to disable. Used in vendors/delivery-webhook.' },
      ],
    },
  ];

  const queryParams = [
    { name: 'page', type: 'integer', endpoint: 'sms-logs, sender-names', desc: 'Page number. Defaults to 1.' },
    { name: 'per_page', type: 'integer', endpoint: 'sms-logs, sender-names', desc: 'Items per page. Defaults to 10 (max 100).' },
    { name: 'status', type: 'string', endpoint: 'sms-logs, sender-names', desc: 'Filter by status. Options: sent, failed, pending (sms-logs) or active, pending, rejected (sender-names).' },
    { name: 'start_date', type: 'string', endpoint: 'sms-logs', desc: 'Start date for log filtering (ISO 8601 or YYYY-MM-DD).' },
    { name: 'end_date', type: 'string', endpoint: 'sms-logs', desc: 'End date for log filtering (ISO 8601 or YYYY-MM-DD).' },
    { name: 'dest_addr', type: 'string', endpoint: 'delivery-reports', desc: 'Destination phone number (required).' },
    { name: 'request_id', type: 'string', endpoint: 'delivery-reports', desc: 'SMS request/transaction ID from send response (required).' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Parameters</h1>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Request Body Parameters</h2>
        <p className="text-gray-600 dark:text-gray-400">
          For POST, PUT, and PATCH requests, set <code className="text-xs font-mono">Content-Type: application/json</code>. The body must be a JSON object.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 text-gray-700 dark:text-gray-300 font-semibold">Parameter</th>
                <th className="text-left py-2 pr-4 text-gray-700 dark:text-gray-300 font-semibold">Type</th>
                <th className="text-left py-2 pr-4 text-gray-700 dark:text-gray-300 font-semibold">Required</th>
                <th className="text-left py-2 text-gray-700 dark:text-gray-300 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {bodyParams[0].params.map(p => (
                <tr key={p.name}>
                  <td className="py-2.5 pr-4"><code className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">{p.name}</code></td>
                  <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{p.type}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${p.required === 'Yes' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                      {p.required}
                    </span>
                  </td>
                  <td className="py-2.5 text-gray-600 dark:text-gray-400">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Query Parameters</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Appended to the URL after <code className="text-xs font-mono">?</code> for filtering and pagination.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 text-gray-700 dark:text-gray-300 font-semibold">Parameter</th>
                <th className="text-left py-2 pr-4 text-gray-700 dark:text-gray-300 font-semibold">Type</th>
                <th className="text-left py-2 pr-4 text-gray-700 dark:text-gray-300 font-semibold">Applies To</th>
                <th className="text-left py-2 text-gray-700 dark:text-gray-300 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {queryParams.map(p => (
                <tr key={p.name}>
                  <td className="py-2.5 pr-4"><code className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">{p.name}</code></td>
                  <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{p.type}</td>
                  <td className="py-2.5 pr-4"><code className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">{p.endpoint}</code></td>
                  <td className="py-2.5 text-gray-600 dark:text-gray-400">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
