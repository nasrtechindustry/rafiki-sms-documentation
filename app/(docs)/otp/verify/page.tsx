'use client';

import { useEffect, useState } from 'react';
import { ApiEndpoint } from '@/components/ApiEndpoint';
import { resolveBaseUrl } from '@/lib/baseUrl';
import { AlertTriangle } from 'lucide-react';

export default function OtpVerifyPage() {
  const [baseUrl, setBaseUrl] = useState('https://api.rafikisms.com');
  useEffect(() => { setBaseUrl(resolveBaseUrl()); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-3">Verify OTP</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Verify the 6-digit code from SMS using the <strong>reference_id</strong> returned by Generate OTP.
          Public endpoint --- no API key required. Accepts field name aliases:{' '}
          <code className="text-xs font-mono">phone</code> -&gt; <code className="text-xs font-mono">phone_number</code>;{' '}
          <code className="text-xs font-mono">code</code> or <code className="text-xs font-mono">otp</code> -&gt;{' '}
          <code className="text-xs font-mono">otp_code</code>;{' '}
          <code className="text-xs font-mono">referenceId</code> or <code className="text-xs font-mono">ref_id</code> -&gt;{' '}
          <code className="text-xs font-mono">reference_id</code>.
        </p>
      </div>

      <ApiEndpoint
        title="Verify OTP"
        method="POST"
        url={`${baseUrl}/v1/otp/verify`}
        description="phone_number --- must match the number used in Generate OTP. otp_code --- 6-digit code received via SMS. reference_id --- UUID returned by Generate OTP. No API key required. Maximum 5 wrong attempts per reference_id."
        headers={[
          { key: 'Accept', value: 'application/json', enabled: true },
          { key: 'Content-Type', value: 'application/json', enabled: true },
        ]}
        requestBody={{
          phone_number: '255712345678',
          otp_code: '482916',
          reference_id: '550e8400-e29b-41d4-a716-446655440000',
        }}
        successResponse={{ success: true, message: 'Verification successful.', data: { verified: true } }}
        errorResponse={{
          success: false,
          message: 'Invalid code.',
          error_code: 'INVALID_CODE',
          attempts_remaining: 3,
        }}
      />

      <div className="flex gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
        <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 dark:text-amber-300">
          <p className="font-semibold mb-2">Error codes</p>
          <ul className="space-y-1">
            <li><code className="text-xs font-mono">INVALID_REFERENCE</code> --- reference_id not found or phone mismatch.</li>
            <li><code className="text-xs font-mono">CODE_ALREADY_USED</code> --- OTP was already verified.</li>
            <li><code className="text-xs font-mono">CODE_EXPIRED</code> --- OTP expired (5-minute TTL).</li>
            <li><code className="text-xs font-mono">INVALID_CODE</code> --- Wrong code. Response includes <code className="text-xs font-mono">attempts_remaining</code>.</li>
            <li><code className="text-xs font-mono">ATTEMPTS_EXCEEDED</code> (429) --- 5 wrong attempts reached. Request a new OTP.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
