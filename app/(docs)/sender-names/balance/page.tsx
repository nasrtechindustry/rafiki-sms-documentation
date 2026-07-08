'use client';

import { useEffect, useState } from 'react';
import { ApiEndpoint } from '@/components/ApiEndpoint';
import { resolveBaseUrl } from '@/lib/baseUrl';

export default function BalancePage() {
  const [baseUrl, setBaseUrl] = useState('https://api.rafikisms.com');
  useEffect(() => { setBaseUrl(resolveBaseUrl()); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Check Balance</h1>
      <ApiEndpoint
        title="Check Balance"
        method="GET"
        url={`${baseUrl}/v1/vendor/balance`}
        description="Check your remaining SMS credit balance. Returns the current credit balance available for your account."
        headers={[
          { key: 'Accept', value: 'application/json', enabled: true },
          { key: 'X-API-Key', value: 'sk_your_api_key_here', enabled: true },
        ]}
        successResponse={{
          status: 'success',
          message: 'Balance retrieved successfully',
          data: { credit_balance: 1000 },
        }}
        errorResponse={{
          status: 'error',
          message: 'Failed to check balance',
          errors: ['Invalid or inactive API key'],
        }}
      />
    </div>
  );
}
