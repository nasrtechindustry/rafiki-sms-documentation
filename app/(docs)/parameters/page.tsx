export default function ParametersPage() {
  const params = [
    { name: 'phone', type: 'string', required: 'Yes', desc: 'Phone number in international format (e.g., 255712345678)' },
    { name: 'message', type: 'string', required: 'Yes', desc: 'SMS message content (max 160 characters)' },
    { name: 'sender_id', type: 'string', required: 'No', desc: 'Approved sender name (max 11 characters)' },
    { name: 'recipients', type: 'array', required: 'No', desc: 'Array of phone numbers for bulk SMS' },
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
              {params.map(p => (
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

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Query Parameters</h2>
        <p className="text-gray-600 dark:text-gray-400">Appended to the URL after <code className="text-xs font-mono">?</code> for filtering and pagination:</p>
        <ul className="list-disc ml-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li><code className="text-xs font-mono">?page=1</code> --- page number</li>
          <li><code className="text-xs font-mono">?per_page=10</code> --- items per page</li>
          <li><code className="text-xs font-mono">?q=search_term</code> --- search query</li>
          <li><code className="text-xs font-mono">?status=active</code> --- filter by status</li>
          <li><code className="text-xs font-mono">?dest_addr=255712345678</code> --- filter delivery reports by phone</li>
          <li><code className="text-xs font-mono">?request_id=19725260</code> --- filter delivery reports by SMS ID</li>
        </ul>
      </section>
    </div>
  );
}
