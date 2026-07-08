'use client';

import { useEffect, useState } from 'react';
import { ApiEndpoint } from '@/components/ApiEndpoint';
import { resolveBaseUrl } from '@/lib/baseUrl';

export default function RequestSenderNamePage() {
  const [baseUrl, setBaseUrl] = useState('https://api.rafikisms.com');
  useEffect(() => { setBaseUrl(resolveBaseUrl()); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Request Sender Name</h1>
      <ApiEndpoint
        title="Request Sender Name"
        method="POST"
        url={`${baseUrl}/v1/vendor/sender-names/request`}
        description="Request a new sender name using your API key. The sender ID must not exceed 11 characters and can only contain letters, numbers, spaces, hyphens (-), and dots (.). Sample content must be at least 15 characters describing the purpose of the sender name."
        headers={[
          { key: 'Accept', value: 'application/json', enabled: true },
          { key: 'Content-Type', value: 'application/json', enabled: true },
          { key: 'X-API-Key', value: 'sk_your_api_key_here', enabled: true },
        ]}
        requestBody={{
          senderid: 'STARSHINE',
          sample_content: 'This sender name will be used for sending order confirmations and delivery notifications to our customers',
        }}
        successResponse={{
          status: 'success',
          message: 'Sender name requested successfully',
          data: { senderid: 'STARSHINE', sample_content: 'This sender name will be used for sending order confirmations', id: '24e1ffaf-e399-4b15-983a-53539e4970bd', status: 'pending' },
        }}
        errorResponse={{
          status: 'error',
          message: 'Validation failed',
          errors: { senderid: ['Sender ID must not exceed 11 characters'], sample_content: ['Sample content must be at least 15 characters'] },
        }}
      />
    </div>
  );
}
