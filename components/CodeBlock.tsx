'use client';

import { useState, useEffect, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { codeToHtml } from 'shiki';
import { useTheme } from './ThemeProvider';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Lang = 'javascript' | 'python' | 'curl' | 'php' | 'go';

const LANGS: { value: Lang; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'curl', label: 'cURL' },
  { value: 'php', label: 'PHP' },
  { value: 'go', label: 'Go' },
];

const SHIKI_LANG: Record<Lang, string> = {
  javascript: 'javascript',
  python: 'python',
  curl: 'bash',
  php: 'php',
  go: 'go',
};

function generateCode(
  lang: Lang,
  method: RequestMethod,
  url: string,
  headers: Array<{ key: string; value: string }>,
  body?: object,
): string {
  const hdrs = headers.reduce((a, { key, value }) => ({ ...a, [key]: value }), {} as Record<string, string>);

  if (lang === 'javascript') {
    const opts: Record<string, unknown> = { method, headers: hdrs };
    if (body && method !== 'GET') opts.body = JSON.stringify(body, null, 2);
    return `const options = ${JSON.stringify(opts, null, 2)};

fetch("${url}", options)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;
  }

  if (lang === 'python') {
    return `import requests

url = "${url}"
headers = ${JSON.stringify(hdrs, null, 2)}
${body && method !== 'GET' ? `payload = ${JSON.stringify(body, null, 2)}\n` : ''}
response = requests.${method.toLowerCase()}(
    url,
    headers=headers${body && method !== 'GET' ? ',\n    json=payload' : ''}
)
print(response.status_code)
print(response.json())`;
  }

  if (lang === 'curl') {
    const hdrFlags = headers.map(({ key, value }) => `-H "${key}: ${value}"`).join(' \\\n  ');
    const bodyFlag = body && method !== 'GET' ? ` \\\n  -d '${JSON.stringify(body)}'` : '';
    return `curl -X ${method} "${url}" \\
  ${hdrFlags}${bodyFlag}`;
  }

  if (lang === 'php') {
    const hdrLines = headers.map(({ key, value }) => `$req->setHeader('${key}', '${value}');`).join('\n');
    return `<?php
require 'vendor/autoload.php';

$client = new GuzzleHttp\\Client();
$req = new GuzzleHttp\\Psr7\\Request('${method}', '${url}');
${hdrLines}
${body && method !== 'GET' ? `$req->getBody()->write('${JSON.stringify(body)}');` : ''}
try {
    $res = $client->send($req);
    echo $res->getBody()->getContents();
} catch (GuzzleHttp\\Exception\\RequestException $e) {
    echo $e->getMessage();
}`;
  }

  // go
  const hdrLines = headers.map(({ key, value }) => `req.Header.Add("${key}", "${value}")`).join('\n\t');
  return `package main

import (
\t"fmt"
\t"io/ioutil"
\t"net/http"
\t"strings"
)

func main() {
\t${body && method !== 'GET' ? `body := strings.NewReader(\`${JSON.stringify(body, null, 2)}\`)
\treq, err := http.NewRequest("${method}", "${url}", body)` : `req, err := http.NewRequest("${method}", "${url}", nil)`}
\tif err != nil { fmt.Println(err); return }
\t${hdrLines}

\tclient := &http.Client{}
\tresp, err := client.Do(req)
\tif err != nil { fmt.Println(err); return }
\tdefer resp.Body.Close()
\tbody, _ := ioutil.ReadAll(resp.Body)
\tfmt.Println(resp.Status)
\tfmt.Println(string(body))
}`;
}

function useHighlight(code: string, lang: string, isDark: boolean) {
  const [html, setHtml] = useState('');
  useEffect(() => {
    codeToHtml(code, {
      lang,
      theme: isDark ? 'github-dark' : 'github-light',
    }).then(setHtml).catch(() => setHtml(`<pre>${code}</pre>`));
  }, [code, lang, isDark]);
  return html;
}

interface JsonBlockProps {
  content: object;
  isDark: boolean;
}

function JsonBlock({ content, isDark }: JsonBlockProps) {
  const [copied, setCopied] = useState(false);
  const code = JSON.stringify(content, null, 2);
  const html = useHighlight(code, 'json', isDark);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <button
        onClick={copy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors z-10"
        aria-label="Copy"
      >
        {copied ? <Check size={14} className="text-teal-500" /> : <Copy size={14} />}
      </button>
      <div
        className="overflow-auto max-h-96 text-sm [&_pre]:!m-0 [&_pre]:p-4 [&_pre]:!rounded-none font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

interface CodeBlockProps {
  endpoint: {
    method: RequestMethod;
    url: string;
    headers: Array<{ key: string; value: string }>;
    body?: object;
  };
}

export function CodeBlock({ endpoint }: CodeBlockProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [lang, setLang] = useState<Lang>('javascript');
  const [copied, setCopied] = useState(false);

  const code = generateCode(lang, endpoint.method, endpoint.url, endpoint.headers, endpoint.body);
  const html = useHighlight(code, SHIKI_LANG[lang], isDark);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1">
          {LANGS.map(l => (
            <button
              key={l.value}
              onClick={() => setLang(l.value)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                lang === l.value
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {copied ? <Check size={13} className="text-teal-500" /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div
        className="overflow-auto max-h-[500px] text-sm [&_pre]:!m-0 [&_pre]:p-4 [&_pre]:!rounded-none font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export { JsonBlock };
