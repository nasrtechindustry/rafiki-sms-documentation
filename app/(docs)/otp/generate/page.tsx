'use client';

import { useEffect, useState } from 'react';
import { ApiEndpoint } from '@/components/ApiEndpoint';
import { resolveBaseUrl } from '@/lib/baseUrl';
import { Info } from 'lucide-react';

export default function OtpGeneratePage() {
  const [baseUrl, setBaseUrl] = useState('https://api.rafikisms.com');
  useEffect(() => { setBaseUrl(resolveBaseUrl()); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-3">Generate OTP</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Request a one-time password sent via SMS. Returns <strong>reference_id</strong> only --- the OTP
          code is never in the API response. Pair with <strong>Verify OTP</strong>. Requires a vendor{' '}
          <code className="text-xs font-mono">X-API-Key</code>. Rate limit: 3 generate calls per phone
          per 5 minutes. Uses SMS credits.
        </p>
      </div>

      <ApiEndpoint
        title="Generate OTP"
        method="POST"
        url={`${baseUrl}/v1/otp/generate`}
        description="phone_number or phone --- destination number (E.164 or local 0XXXXXXXXX). sender_id (optional) --- one of your approved sender names. If omitted, your default sender is used. Returns reference_id + expires_in_seconds (300)."
        headers={[
          { key: 'Accept', value: 'application/json', enabled: true },
          { key: 'Content-Type', value: 'application/json', enabled: true },
          { key: 'X-API-Key', value: 'sk_your_vendor_api_key', enabled: true },
        ]}
        requestBody={{ phone_number: '255712345678', sender_id: 'MYSHOP-OTP' }}
        successResponse={{
          success: true,
          message: 'OTP sent successfully.',
          data: { reference_id: '550e8400-e29b-41d4-a716-446655440000', expires_in_seconds: 300 },
        }}
        errorResponse={{
          success: false,
          message: 'Too many OTP generation attempts.',
          error_code: 'OTP_RATE_LIMIT_EXCEEDED',
        }}
      />

      <div className="flex gap-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
        <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <p className="font-semibold">Security notice</p>
          <p>
            The OTP code is never returned in any API response --- only <code className="text-xs font-mono">reference_id</code> is returned.
            Use Verify OTP with the 6-digit code the user received via SMS.
            Each <code className="text-xs font-mono">reference_id</code> allows a maximum of 5 verification attempts before it is locked.
          </p>
        </div>
      </div>
    </div>
  );
}
