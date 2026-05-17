'use client';

import { useEffect, useState } from 'react';
import { ApiEndpoint } from '@/components/ApiEndpoint';
import { resolveBaseUrl } from '@/lib/baseUrl';

export default function GetSenderNamesPage() {
  const [baseUrl, setBaseUrl] = useState('https://api.rafikisms.com');
  useEffect(() => { setBaseUrl(resolveBaseUrl()); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Get Sender Names</h1>
      <ApiEndpoint
        title="Get Sender Names"
        method="GET"
        url={`${baseUrl}/v1/vendor/sender-names`}
        description="Retrieve all registered sender names for your account. Results are automatically filtered to show only sender names associated with your API key."
        headers={[
          { key: 'Accept', value: 'application/json', enabled: true },
          { key: 'X-API-Key', value: 'sk_your_api_key_here', enabled: true },
        ]}
        successResponse={{
          success: true,
          message: 'Sender names retrieved successfully',
          data: {
            sender_names: [
              { id: 'c893d701-e1d8-4b00-8634-8c464e56ba11', senderid: 'STARSHINE', sample_content: 'This sender name is used for order confirmations', status: 'active', created: '2025-07-08T14:07:56.000Z' },
            ],
            pagination: { totalItems: 1, currentPage: 1, pageSize: 25, totalPages: 1 },
          },
        }}
        errorResponse={{ success: false, message: 'Failed to retrieve sender names', error_code: 'GET_SENDER_NAMES_FAILED' }}
      />
    </div>
  );
}
