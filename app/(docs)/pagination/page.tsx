export default function PaginationPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Pagination</h1>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Endpoints that return lists support pagination. Paginated responses include metadata about the current page and totals.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Query Parameters</h2>
        <ul className="list-disc ml-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li><code className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">page</code> - page number (default: 1)</li>
          <li><code className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">per_page</code> - items per page (default: 10, max: 100)</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Response Format</h2>
        <p className="text-gray-600 dark:text-gray-400">Paginated responses follow this structure:</p>
        <div className="rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 font-mono text-sm text-gray-800 dark:text-gray-200 overflow-auto">
          <pre>{`{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [...],
    "per_page": 10,
    "total": 100,
    "last_page": 10,
    "from": 1,
    "to": 10
  }
}`}</pre>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Example Request</h2>
        <div className="rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 font-mono text-sm text-gray-800 dark:text-gray-200">
          GET /v1/sms-logs?page=2&per_page=20
        </div>
      </section>
    </div>
  );
}
