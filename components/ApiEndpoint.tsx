'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { CodeBlock, JsonBlock } from './CodeBlock';
import { useTheme } from './ThemeProvider';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiEndpointProps {
  title: string;
  method: RequestMethod;
  url: string;
  description?: string;
  headers: Array<{ key: string; value: string; enabled?: boolean }>;
  requestBody?: object;
  successResponse?: object;
  errorResponse?: object;
}

const METHOD_STYLES: Record<RequestMethod, string> = {
  GET: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  POST: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  PUT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const TABS = ['Headers', 'Request Body', 'Success Response', 'Error Response', 'Sample Code'] as const;
type Tab = (typeof TABS)[number];

export function ApiEndpoint({
  title,
  method,
  url,
  description,
  headers,
  requestBody,
  successResponse,
  errorResponse,
}: ApiEndpointProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expanded, setExpanded] = useState(true);
  const [tab, setTab] = useState<Tab>('Headers');
  const [urlCopied, setUrlCopied] = useState(false);

  const availableTabs: Tab[] = [
    'Headers',
    ...(requestBody ? ['Request Body' as Tab] : []),
    ...(successResponse ? ['Success Response' as Tab] : []),
    ...(errorResponse ? ['Error Response' as Tab] : []),
    'Sample Code',
  ];

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm mb-6 overflow-hidden">
      {/* Header row */}
      <div className="flex items-start sm:items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${METHOD_STYLES[method]}`}>
              {method}
            </span>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          </div>
          <div className="flex items-center gap-2 group">
            <code className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">{url}</code>
            <button
              onClick={copyUrl}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all shrink-0"
              aria-label="Copy URL"
            >
              {urlCopied ? <Check size={13} className="text-teal-500" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Body */}
      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {description && (
            <p className="px-5 pt-4 text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}

          {/* Tab bar */}
          <div className="flex gap-1 px-4 pt-3 pb-0 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
            {availableTabs.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
                  tab === t
                    ? 'border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4 sm:p-5">
            {tab === 'Headers' && <JsonBlock content={headers} isDark={isDark} />}
            {tab === 'Request Body' && requestBody && <JsonBlock content={requestBody} isDark={isDark} />}
            {tab === 'Success Response' && successResponse && <JsonBlock content={successResponse} isDark={isDark} />}
            {tab === 'Error Response' && errorResponse && <JsonBlock content={errorResponse} isDark={isDark} />}
            {tab === 'Sample Code' && (
              <CodeBlock
                endpoint={{
                  method,
                  url,
                  headers: headers.filter(h => h.enabled !== false),
                  body: requestBody,
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
