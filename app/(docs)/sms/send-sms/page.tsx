'use client';

import { useEffect, useState } from 'react';
import { ApiEndpoint } from '@/components/ApiEndpoint';
import { resolveBaseUrl } from '@/lib/baseUrl';

export default function SendSmsPage() {
  const [baseUrl, setBaseUrl] = useState('https://api.rafikisms.com');
  useEffect(() => { setBaseUrl(resolveBaseUrl()); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Send SMS</h1>
      <ApiEndpoint
        title="Send Single SMS"
        method="POST"
        url={`${baseUrl}/v1/vendor/send-sms`}
        description="Send an SMS message to a single recipient using your API key. The message will be queued and processed asynchronously. Phone number must be in international format (e.g., 255712345678) without the + sign. Optional sender: include one of source_address, sender_id, or sender (max 11 characters, must be approved for your account). If omitted, the default sender from your SMS credentials is used."
        headers={[
          { key: 'Accept', value: 'application/json', enabled: true },
          { key: 'Content-Type', value: 'application/json', enabled: true },
          { key: 'X-API-Key', value: 'sk_your_api_key_here', enabled: true },
        ]}
        requestBody={{ phone: '255712345678', message: 'Hello! This is a test message from RafikiSMS.', sender_id: 'MYBRAND' }}
        successResponse={{
          status: 'success',
          message: 'SMS queued successfully',
          data: { message: 'SMS has been queued for sending', note: 'SMS will be processed asynchronously. Check SMS logs for status updates.' },
        }}
        errorResponse={{
          status: 'error',
          message: 'Failed to send SMS',
          errors: {
            phone: ['Invalid phone number format'],
            message: ['Message is required', 'Message must not exceed 160 characters'],
            source_address: ['Sender ID must not exceed 11 characters'],
          },
        }}
      />
    </div>
  );
}
