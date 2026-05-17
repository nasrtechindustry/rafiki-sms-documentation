'use client';

import { useEffect, useState } from 'react';
import { ApiEndpoint } from '@/components/ApiEndpoint';
import { resolveBaseUrl } from '@/lib/baseUrl';

export default function DeliveryReportsPage() {
  const [baseUrl, setBaseUrl] = useState('https://api.rafikisms.com');
  useEffect(() => { setBaseUrl(resolveBaseUrl()); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Delivery Reports</h1>
      <ApiEndpoint
        title="Get Delivery Report"
        method="GET"
        url={`${baseUrl}/v1/vendor/delivery-reports?dest_addr=255712345678&request_id=19725260`}
        description="Check the delivery status of an SMS message. Requires query parameters: dest_addr (phone number) and request_id (from SMS send response). Check 5 minutes or later after sending to allow for network delays. Status: DELIVERED, PENDING, or UNDELIVERED."
        headers={[
          { key: 'Accept', value: 'application/json', enabled: true },
          { key: 'X-API-Key', value: 'sk_your_api_key_here', enabled: true },
        ]}
        successResponse={{
          status: 'success',
          message: 'Delivery report retrieved successfully',
          data: { delivery_reports: [{ dest_addr: '255712345678', status: 'DELIVERED', request_id: '19725260' }] },
        }}
        errorResponse={{
          status: 'error',
          message: 'Invalid request_id or dest_addr',
          errors: { dest_addr: ['The dest addr field is required.'], request_id: ['The request id field is required.'] },
        }}
      />
    </div>
  );
}
