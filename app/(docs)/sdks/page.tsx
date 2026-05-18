'use client';

import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { useTheme } from '@/components/ThemeProvider';
import { resolveBaseUrl } from '@/lib/baseUrl';
import { Copy, Check, ExternalLink, GitBranch } from 'lucide-react';

type Lang = 'shell' | 'node' | 'php' | 'python' | 'go' | 'java';

const LANGS: { value: Lang; label: string; shiki: string }[] = [
  { value: 'shell', label: 'Shell', shiki: 'bash' },
  { value: 'node', label: 'Node.js', shiki: 'javascript' },
  { value: 'php', label: 'PHP', shiki: 'php' },
  { value: 'python', label: 'Python', shiki: 'python' },
  { value: 'go', label: 'Go', shiki: 'go' },
  { value: 'java', label: 'Java', shiki: 'java' },
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
    shell: `# Send SMS
curl -X POST ${baseUrl}/v1/vendor/send-sms \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sk_your_api_key_here" \\
  -d '{"phone":"255712345678","message":"Hello!","sender_id":"MYBRAND"}'

# Send Bulk SMS
curl -X POST ${baseUrl}/v1/vendor/send-bulk-sms \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sk_your_api_key_here" \\
  -d '{"recipients":["255712345678","255621728109"],"message":"Bulk hello!","sender_id":"MYBRAND"}'

# Generate OTP
curl -X POST ${baseUrl}/v1/otp/generate \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sk_your_api_key_here" \\
  -d '{"phone_number":"255712345678","sender_id":"MYSHOP-OTP"}'

# Verify OTP
curl -X POST ${baseUrl}/v1/otp/verify \\
  -H "Content-Type: application/json" \\
  -d '{"phone_number":"255712345678","otp_code":"482916","reference_id":"uuid-from-generate"}'

# Balance
curl -H "X-API-Key: sk_your_api_key_here" ${baseUrl}/v1/vendor/balance

# SMS Logs
curl -H "X-API-Key: sk_your_api_key_here" "${baseUrl}/v1/vendor/sms-logs?page=1&per_page=20"

# Delivery Report
curl -H "X-API-Key: sk_your_api_key_here" "${baseUrl}/v1/vendor/delivery-reports?dest_addr=255712345678&request_id=19725260"

# Sender Names
curl -H "X-API-Key: sk_your_api_key_here" ${baseUrl}/v1/vendor/sender-names

# Request Sender Name
curl -X POST ${baseUrl}/v1/sender-names/request \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sk_your_api_key_here" \\
  -d '{"senderid":"MYBRAND","sample_content":"Used for order confirmations"}'

# Delivery Webhook
curl -X PUT ${baseUrl}/v1/vendors/delivery-webhook \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sk_your_api_key_here" \\
  -d '{"delivery_webhook_url":"https://example.com/webhooks/sms"}'`,
    node: `import { createRafikismsClient } from "@rafikisms/sdk";

const client = createRafikismsClient({
  apiKey: process.env.RAFIKISMS_API_KEY,
});

// Send SMS
const sms = await client.sendSms({
  phone: "255712345678",
  message: "Hello from RafikiSMS!",
  sender_id: "MYBRAND",
});

// Send Bulk SMS
const bulk = await client.sendBulkSms({
  recipients: ["255712345678", "255621728109"],
  message: "Bulk message!",
  sender_id: "MYBRAND",
});

// Generate OTP
const otp = await client.generateOtp({
  phone_number: "255712345678",
  sender_id: "MYSHOP-OTP",
});

// Verify OTP
const verified = await client.verifyOtp({
  phone_number: "255712345678",
  otp_code: "482916",
  reference_id: otp.data.reference_id,
});

// Balance
const balance = await client.getBalance();
console.log("Credits:", balance.data?.credit_balance);

// SMS Logs
const logs = await client.getSmsLogs({ page: 1, per_page: 20 });

// Delivery Report
const report = await client.getDeliveryReport("255712345678", "19725260");

// Sender Names
const names = await client.getSenderNames();

// Request Sender Name
const req = await client.requestSenderName({
  senderid: "MYBRAND",
  sample_content: "Used for order confirmations",
});

// Delivery Webhook
const webhook = await client.updateDeliveryWebhook({
  delivery_webhook_url: "https://example.com/webhooks/sms",
});`,
    php: `<?php

require 'vendor/autoload.php';

use Rafikisms\\Client;

$client = new Client(apiKey: getenv('RAFIKISMS_API_KEY'));

// Send SMS
$client->sendSms(['phone' => '255712345678', 'message' => 'Hello!', 'sender_id' => 'MYBRAND']);

// Send Bulk SMS
$client->sendBulkSms([
    'recipients' => ['255712345678', '255621728109'],
    'message' => 'Bulk message!',
    'sender_id' => 'MYBRAND',
]);

// Generate OTP
$otp = $client->generateOtp(['phone_number' => '255712345678', 'sender_id' => 'MYSHOP-OTP']);

// Verify OTP
$client->verifyOtp([
    'phone_number' => '255712345678',
    'otp_code' => '482916',
    'reference_id' => $otp->data['reference_id'],
]);

// Balance
$balance = $client->getBalance();
$credits = $balance->getData()['credit_balance'] ?? 0;

// SMS Logs
$logs = $client->getSmsLogs(['page' => 1, 'per_page' => 20]);

// Delivery Report
$client->getDeliveryReport('255712345678', '19725260');

// Sender Names
$client->getSenderNames();

// Request Sender Name
$client->requestSenderName('MYBRAND', 'Used for order confirmations');

// Delivery Webhook
$client->updateDeliveryWebhook('https://example.com/webhooks/sms');`,
    python: `from rafikisms import Client

client = Client(
    "https://api.rafikisms.com",
    os.environ["RAFIKISMS_API_KEY"],
)

# Send SMS
client.send_sms({"phone": "255712345678", "message": "Hello!", "sender_id": "MYBRAND"})

# Send Bulk SMS
client.send_bulk_sms({
    "recipients": ["255712345678", "255621728109"],
    "message": "Bulk message!",
    "sender_id": "MYBRAND",
})

# Generate OTP
otp = client.generate_otp({"phone_number": "255712345678", "sender_id": "MYSHOP-OTP"})

# Verify OTP
client.verify_otp({
    "phone_number": "255712345678",
    "otp_code": "482916",
    "reference_id": otp.data["reference_id"],
})

# Balance
bal = client.get_balance()
print(bal.data["credit_balance"])

# SMS Logs
client.get_sms_logs({"page": 1, "per_page": 20})

# Delivery Report
client.get_delivery_report("255712345678", "19725260")

# Sender Names
client.get_sender_names()

# Request Sender Name
client.request_sender_name("MYBRAND", "Used for order confirmations")

# Delivery Webhook
client.update_delivery_webhook("https://example.com/webhooks/sms")`,
    go: `package main

import (
    "context"
    "fmt"
    "os"

    rafikisms "github.com/nasrtechindustry/rafikisms-sdk/sdk/go"
)

func main() {
    c := rafikisms.NewClient(
        "https://api.rafikisms.com",
        os.Getenv("RAFIKISMS_API_KEY"),
    )
    ctx := context.Background()

    // Send SMS
    c.SendSms(ctx, rafikisms.SendSmsRequest{Phone: "255712345678", Message: "Hello!", SenderID: "MYBRAND"})

    // Send Bulk SMS
    c.SendBulkSms(ctx, rafikisms.SendBulkSmsRequest{
        Recipients: []string{"255712345678", "255621728109"},
        Message:    "Bulk message!",
        SenderID:   "MYBRAND",
    })

    // Generate OTP
    c.GenerateOTP(ctx, rafikisms.GenerateOTPRequest{PhoneNumber: "255712345678", SenderID: "MYSHOP-OTP"})

    // Verify OTP
    c.VerifyOTP(ctx, rafikisms.VerifyOTPRequest{PhoneNumber: "255712345678", OTPCode: "482916", ReferenceID: "uuid"})

    // Balance
    bal, _ := c.GetBalance(ctx)
    fmt.Println(bal.Message)

    // SMS Logs
    page, perPage := 1, 20
    c.GetSmsLogs(ctx, rafikisms.SmsLogsQuery{Page: &page, PerPage: &perPage})

    // Delivery Report
    c.GetDeliveryReport(ctx, "255712345678", "19725260")

    // Sender Names
    c.GetSenderNames(ctx)

    // Request Sender Name
    c.RequestSenderName(ctx, rafikisms.RequestSenderNameRequest{
        Senderid: "MYBRAND", SampleContent: "Used for order confirmations",
    })

    // Delivery Webhook
    url := "https://example.com/webhooks/sms"
    c.UpdateDeliveryWebhook(ctx, rafikisms.UpdateDeliveryWebhookRequest{DeliveryWebhookURL: &url})
}`,
    java: `import com.rafikisms.sdk.RafikismsClient;
import com.rafikisms.sdk.RafikismsResult;

import java.util.Map;

RafikismsClient client = RafikismsClient.builder()
    .baseUrl("https://api.rafikisms.com")
    .apiKey(System.getenv("RAFIKISMS_API_KEY"))
    .build();

// Send SMS
client.sendSms(Map.of("phone", "255712345678", "message", "Hello!", "sender_id", "MYBRAND"));

// Send Bulk SMS
client.sendBulkSms(Map.of(
    "recipients", new String[]{"255712345678", "255621728109"},
    "message", "Bulk message!",
    "sender_id", "MYBRAND"
));

// Generate OTP
client.generateOtp(Map.of("phone_number", "255712345678", "sender_id", "MYSHOP-OTP"));

// Verify OTP
client.verifyOtp(Map.of(
    "phone_number", "255712345678",
    "otp_code", "482916",
    "reference_id", "uuid-from-generate"
));

// Balance
RafikismsResult balance = client.getBalance();
int credits = balance.getData().path("credit_balance").asInt();

// SMS Logs
client.getSmsLogs(Map.of("page", "1", "per_page", "20"));

// Delivery Report
client.getDeliveryReport("255712345678", "19725260");

// Sender Names
client.getSenderNames();

// Request Sender Name
client.requestSenderName(Map.of("senderid", "MYBRAND", "sample_content", "Used for order confirmations"));

// Delivery Webhook
client.updateDeliveryWebhook(Map.of("delivery_webhook_url", "https://example.com/webhooks/sms"));`,
  };

  const current = LANGS.find(l => l.value === activeLang)!;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">SDKs & Tools</h1>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          First-party SDKs for the RafikiSMS Vendor API. All SDKs expose the same 10 endpoints
          with consistent field names and response formats.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border-l-4 border-l-yellow-400 border border-gray-200 dark:border-gray-700 p-4 space-y-2 bg-gradient-to-r from-yellow-50/50 to-transparent dark:from-yellow-900/10 dark:to-transparent">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-yellow-400 flex items-center justify-center p-1">
                <img src="/icons/javascript.svg" alt="JS" className="w-full h-full" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">@rafikisms/sdk</h3>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">JavaScript / TypeScript</p>
            <code className="block text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-2 rounded font-mono border border-yellow-200 dark:border-yellow-800">npm install @rafikisms/sdk</code>
          </div>
          <div className="rounded-lg border-l-4 border-l-indigo-400 border border-gray-200 dark:border-gray-700 p-4 space-y-2 bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-indigo-400 flex items-center justify-center p-1">
                <img src="/icons/php.svg" alt="PHP" className="w-full h-full" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">rafikisms/sdk</h3>
            </div>
            <p className="text-xs text-indigo-700 dark:text-indigo-400 font-medium">PHP (8.1+, ext-curl)</p>
            <code className="block text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-3 py-2 rounded font-mono border border-indigo-200 dark:border-indigo-800">composer require rafikisms/sdk</code>
          </div>
          <div className="rounded-lg border-l-4 border-l-blue-400 border border-gray-200 dark:border-gray-700 p-4 space-y-2 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-400 flex items-center justify-center p-1">
                <img src="/icons/python.svg" alt="Python" className="w-full h-full" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">rafikisms-sdk</h3>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Python (3.10+, httpx)</p>
            <code className="block text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-2 rounded font-mono border border-blue-200 dark:border-blue-800">pip install rafikisms-sdk</code>
          </div>
          <div className="rounded-lg border-l-4 border-l-cyan-400 border border-gray-200 dark:border-gray-700 p-4 space-y-2 bg-gradient-to-r from-cyan-50/50 to-transparent dark:from-cyan-900/10 dark:to-transparent">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-cyan-400 flex items-center justify-center p-1">
                <img src="/icons/go.svg" alt="Go" className="w-full h-full" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">rafikisms/sdk/go</h3>
            </div>
            <p className="text-xs text-cyan-700 dark:text-cyan-400 font-medium">Go (1.22+)</p>
            <code className="block text-xs bg-cyan-50 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 px-3 py-2 rounded font-mono border border-cyan-200 dark:border-cyan-800">go get github.com/nasrtechindustry/rafikisms-sdk/sdk/go</code>
          </div>
          <div className="rounded-lg border-l-4 border-l-orange-400 border border-gray-200 dark:border-gray-700 p-4 space-y-2 bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-900/10 dark:to-transparent">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-orange-400 flex items-center justify-center p-1">
                <img src="/icons/java.svg" alt="Java" className="w-full h-full" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">rafikisms-java-sdk</h3>
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-400 font-medium">Java (17+, Maven)</p>
            <code className="block text-xs bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-3 py-2 rounded font-mono border border-orange-200 dark:border-orange-800">mvn install</code>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Full API Usage by Language</h2>

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

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-2">
          <GitBranch size={16} />
          <span>Source code:</span>
          <a
            href="https://github.com/nasrtechindustry/rafikisms-sdk/tree/main/sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline"
          >
            github.com/nasrtechindustry/rafikisms-sdk <ExternalLink size={12} />
          </a>
        </div>
      </section>
    </div>
  );
}
