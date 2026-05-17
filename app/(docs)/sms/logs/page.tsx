'use client';

import { useEffect, useState } from 'react';
import { ApiEndpoint } from '@/components/ApiEndpoint';
import { resolveBaseUrl } from '@/lib/baseUrl';

export default function SmsLogsPage() {
  const [baseUrl, setBaseUrl] = useState('https://api.rafikisms.com');
  useEffect(() => { setBaseUrl(resolveBaseUrl()); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">SMS Logs</h1>
      <ApiEndpoint
        title="Get SMS Logs"
        method="GET"
        url={`${baseUrl}/v1/sms-logs`}
        description="Retrieve SMS logs for the authenticated user. Returns a paginated list of all SMS messages sent by the user."
        headers={[
          { key: 'Accept', value: 'application/json', enabled: true },
          { key: 'Authorization', value: 'Bearer YOUR_ACCESS_TOKEN', enabled: true },
        ]}
        successResponse={{
          status: 'success',
          message: 'SMS logs retrieved successfully',
          data: {
            current_page: 1,
            data: [
              {
                id: 15,
                user_id: 4,
                recipient: '255712345678',
                message: 'Hello! This is a test message',
                status: 'success',
                transaction_id: '19725260',
                created_at: '2025-12-11T13:10:15.000000Z',
                updated_at: '2025-12-11T13:10:17.000000Z',
              },
            ],
            per_page: 10,
            total: 15,
            last_page: 2,
          },
        }}
        errorResponse={{ message: 'Unauthenticated.' }}
      />
    </div>
  );
}
