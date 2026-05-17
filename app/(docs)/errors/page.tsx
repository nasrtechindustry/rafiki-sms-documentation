import { Info } from 'lucide-react';

const HTTP_CODES = [
  { code: '400', desc: 'Bad Request --- Invalid parameters or malformed request' },
  { code: '401', desc: 'Unauthorized --- Missing or invalid API key / token' },
  { code: '403', desc: 'Forbidden --- Insufficient permissions' },
  { code: '404', desc: 'Not Found --- Resource does not exist' },
  { code: '422', desc: 'Unprocessable Entity --- Validation errors' },
  { code: '429', desc: 'Too Many Requests --- Rate limit exceeded' },
  { code: '500', desc: 'Internal Server Error --- Server error occurred' },
];

export default function ErrorsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Errors</h1>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          The RafikiSMS API uses standard HTTP status codes. Error responses include a JSON body with details about what went wrong.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Error Response Format</h2>
        <div className="rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 font-mono text-sm text-gray-800 dark:text-gray-200 overflow-auto">
          <pre>{`{
  "status": "error",
  "message": "Error message description",
  "errors": {
    "field_name": ["Error message for this field"]
  }
}`}</pre>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">HTTP Status Codes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-6 text-gray-700 dark:text-gray-300 font-semibold">Status Code</th>
                <th className="text-left py-2 text-gray-700 dark:text-gray-300 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {HTTP_CODES.map(({ code, desc }) => (
                <tr key={code}>
                  <td className="py-2.5 pr-6">
                    <code className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded text-gray-800 dark:text-gray-200">{code}</code>
                  </td>
                  <td className="py-2.5 text-gray-600 dark:text-gray-400">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Validation Errors (422)</h2>
        <p className="text-gray-600 dark:text-gray-400">
          When validation fails, the response includes an <code className="text-xs font-mono">errors</code> object with field-specific messages:
        </p>
        <div className="rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 font-mono text-sm text-gray-800 dark:text-gray-200 overflow-auto">
          <pre>{`{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "phone": ["The phone field is required."],
    "message": ["The message must not exceed 160 characters."]
  }
}`}</pre>
        </div>

        <div className="flex gap-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
          <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Always check the HTTP status code and handle errors gracefully. Implement retry logic with exponential backoff for transient errors (5xx) and rate limits (429).
          </p>
        </div>
      </section>
    </div>
  );
}
