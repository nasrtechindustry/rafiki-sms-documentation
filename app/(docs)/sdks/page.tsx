'use client';

import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { useTheme } from '@/components/ThemeProvider';
import { resolveBaseUrl } from '@/lib/baseUrl';
import { Copy, Check } from 'lucide-react';

type Lang = 'shell' | 'node' | 'php' | 'python' | 'ruby';

const LANGS: { value: Lang; label: string; shiki: string }[] = [
  { value: 'shell', label: 'Shell', shiki: 'bash' },
  { value: 'node', label: 'Node.js', shiki: 'javascript' },
  { value: 'php', label: 'PHP', shiki: 'php' },
  { value: 'python', label: 'Python', shiki: 'python' },
  { value: 'ruby', label: 'Ruby', shiki: 'ruby' },
];

function useHighlight(code: string, shikiLang: string, isDark: boolean) {
  const [html, setHtml] = useState('');
  useEffect(() => {
    codeToHtml(code, { lang: shikiLang, theme: isDark ? 'github-dark' : 'github-light' })
      .then(setHtml)
      .catch(() => setHtml(`<pre>${code}</pre>`));
  }, [code, shikiLang, isDark]);
  return html;
}

function CodePanel({ code, shikiLang, isDark }: { code: string; shikiLang: string; isDark: boolean }) {
  const html = useHighlight(code, shikiLang, isDark);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative rounded-b-lg overflow-hidden border border-t-0 border-gray-200 dark:border-gray-700">
      <button
        onClick={copy}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
      >
        {copied ? <Check size={12} className="text-teal-500" /> : <Copy size={12} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <div
        className="overflow-auto text-sm [&_pre]:!m-0 [&_pre]:p-5 [&_pre]:!rounded-none font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export default function SdksPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeLang, setActiveLang] = useState<Lang>('shell');
  const [baseUrl, setBaseUrl] = useState('https://api.rafikisms.com');
  useEffect(() => { setBaseUrl(resolveBaseUrl()); }, []);

  const examples: Record<Lang, string> = {
    shell: `curl -X POST ${baseUrl}/v1/vendor/send-sms \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sk_your_api_key_here" \\
  -d '{
    "phone": "255712345678",
    "message": "Hello from RafikiSMS!",
    "sender_id": "MYBRAND"
  }'`,
    node: `const response = await fetch('${baseUrl}/v1/vendor/send-sms', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'sk_your_api_key_here',
  },
  body: JSON.stringify({
    phone: '255712345678',
    message: 'Hello from RafikiSMS!',
    sender_id: 'MYBRAND',
  }),
});

const data = await response.json();
console.log(data);`,
    php: `<?php
$client = new GuzzleHttp\\Client();
$response = $client->post('${baseUrl}/v1/vendor/send-sms', [
    'headers' => [
        'Content-Type' => 'application/json',
        'X-API-Key'    => 'sk_your_api_key_here',
    ],
    'json' => [
        'phone'     => '255712345678',
        'message'   => 'Hello from RafikiSMS!',
        'sender_id' => 'MYBRAND',
    ],
]);
echo $response->getBody();`,
    python: `import requests

url = '${baseUrl}/v1/vendor/send-sms'
headers = {'Content-Type': 'application/json', 'X-API-Key': 'sk_your_api_key_here'}
payload = {'phone': '255712345678', 'message': 'Hello from RafikiSMS!', 'sender_id': 'MYBRAND'}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    ruby: `require 'net/http'
require 'json'
require 'uri'

uri = URI('${baseUrl}/v1/vendor/send-sms')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == 'https'

request = Net::HTTP::Post.new(uri)
request['Content-Type'] = 'application/json'
request['X-API-Key'] = 'sk_your_api_key_here'
request.body = { phone: '255712345678', message: 'Hello from RafikiSMS!', sender_id: 'MYBRAND' }.to_json

response = http.request(request)
puts response.body`,
  };

  const current = LANGS.find(l => l.value === activeLang)!;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">SDKs & Tools</h1>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Use the code examples below to integrate RafikiSMS into your application. The samples call{' '}
          <code className="text-xs font-mono">POST /v1/vendor/send-sms</code> with API key auth.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Client Examples</h2>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {LANGS.map(l => (
            <button
              key={l.value}
              onClick={() => setActiveLang(l.value)}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeLang === l.value
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <CodePanel code={examples[activeLang]} shikiLang={current.shiki} isDark={isDark} />

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 pt-2">Official SDKs</h2>
        <ul className="list-disc ml-5 space-y-2 text-gray-600 dark:text-gray-400 text-sm">
          <li><strong>PHP:</strong> <code className="font-mono text-xs">composer require rafikisms/api-php-sdk</code></li>
          <li><strong>Node.js:</strong> <code className="font-mono text-xs">npm install @rafikisms/api-sdk</code></li>
          <li><strong>Python:</strong> <code className="font-mono text-xs">pip install rafikisms-api</code></li>
          <li><strong>Ruby:</strong> <code className="font-mono text-xs">gem install rafikisms-api</code></li>
        </ul>
        <p className="text-sm text-gray-500 dark:text-gray-400">More SDKs coming soon. Check our GitHub repository for updates.</p>
      </section>
    </div>
  );
}
