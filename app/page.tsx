'use client';

import { useEffect, useState } from 'react';
import { Download, FileText, Tag } from 'lucide-react';
import { resolveBaseUrl } from '@/lib/baseUrl';

export default function OverviewPage() {
  const [baseUrl, setBaseUrl] = useState('https://api.rafikisms.com');

  useEffect(() => {
    const resolved = resolveBaseUrl();
    setBaseUrl(resolved);
    fetch(`${resolved}/v1/docs-config`)
      .then(r => (r.ok ? r.json() : null))
      .then((data: { base_url?: string } | null) => {
        if (data?.base_url) setBaseUrl(String(data.base_url).replace(/\/$/, ''));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">RafikiSMS API</h1>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Tag size={11} /> v1.0.0
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-semibold">
          OAS 3.0
        </span>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Overview</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          The RafikiSMS API is a RESTful API designed for third-party integrations. It allows you to send
          SMS messages, check balances, view registered sender names, and retrieve delivery reports using
          API key authentication.
        </p>
        <p className="text-gray-600 dark:text-gray-400">Base URL (auto-detected from server):</p>
        <div className="rounded-lg bg-gray-100 dark:bg-gray-900 px-4 py-3 font-mono text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
          {baseUrl}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Download API Specification</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Download the API spec for Postman import, YAML, or Markdown format.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/v1/docs/openapi.json" download="rafikisms-openapi.json" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors">
            <Download size={15} /> Download JSON
          </a>
          <a href="/v1/docs/openapi.yaml" download="rafikisms-openapi.yaml" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
            <Download size={15} /> Download YAML
          </a>
          <a href="/v1/docs/openapi.md" download="rafikisms-api.md" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
            <FileText size={15} /> Download Markdown
          </a>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Quick Start</h2>
        <p className="text-gray-600 dark:text-gray-400">Get up and running in minutes:</p>
        <ol className="list-decimal ml-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Create a vendor account or log in to your existing account</li>
          <li>Navigate to <strong className="text-gray-800 dark:text-gray-200">Profile &gt; Integration</strong> to generate your API key</li>
          <li>
            Include your API key in every request header:{' '}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-900 text-xs font-mono">X-API-Key: sk_your_api_key_here</code>
          </li>
          <li>Start making API requests to send SMS messages</li>
        </ol>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Phone Number Format</h2>
        <p className="text-gray-600 dark:text-gray-400">
          All phone numbers must be in international format without the <code className="text-xs font-mono">+</code> sign:
        </p>
        <ul className="list-disc ml-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Format: <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-900 text-xs font-mono">255XXXXXXXXX</code> (12 digits starting with country code)</li>
          <li>Example: <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-900 text-xs font-mono">255712345678</code></li>
          <li>Local numbers starting with 0 are automatically converted (e.g., 0712345678 to 255712345678)</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Message Requirements</h2>
        <ul className="list-disc ml-5 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Maximum length: 160 characters per SMS</li>
          <li>Messages are processed asynchronously via job queues</li>
          <li>Check SMS logs for delivery status</li>
          <li>Bulk SMS supports comma-separated phone numbers or file upload (CSV/Excel)</li>
        </ul>
      </section>
    </div>
  );
}
