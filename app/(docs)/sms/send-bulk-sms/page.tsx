'use client';

import { useEffect, useState } from 'react';
import { ApiEndpoint } from '@/components/ApiEndpoint';
import { resolveBaseUrl } from '@/lib/baseUrl';

export default function SendBulkSmsPage() {
  const [baseUrl, setBaseUrl] = useState('https://api.rafikisms.com');
  useEffect(() => { setBaseUrl(resolveBaseUrl()); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Send Bulk SMS</h1>
      <ApiEndpoint
        title="Send Bulk SMS"
        method="POST"
        url={`${baseUrl}/v1/vendor/send-bulk-sms`}
        description="Send SMS messages to multiple recipients using your API key. JSON body: use recipients (array of strings) or phone (comma-separated). Optional sender: source_address, sender_id, or sender (same rules as single send). You can also send multipart/form-data with message, phone or recipients_file when using the console upload flow."
        headers={[
          { key: 'Accept', value: 'application/json', enabled: true },
          { key: 'Content-Type', value: 'application/json', enabled: true },
          { key: 'X-API-Key', value: 'sk_your_api_key_here', enabled: true },
        ]}
        requestBody={{
          message: 'Your bulk message content (max 160 characters)',
          phone: '255712345678,255621728109,255620656604',
          sender_id: 'MYBRAND',
        }}
        successResponse={{
          status: 'success',
          message: 'Bulk SMS queued successfully',
          data: { message: 'Bulk SMS has been queued for sending', total_recipients: 3, note: 'SMS will be processed asynchronously.' },
        }}
        errorResponse={{
          status: 'error',
          message: 'No valid phone numbers found',
          errors: { message: ['Message is required'], phone: ['At least one recipient method is required'] },
        }}
      />
    </div>
  );
}
