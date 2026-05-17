import { getOpenApiJson } from '@/lib/apiSpec';

export const dynamic = 'force-static';

export function GET() {
  return new Response(getOpenApiJson(), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="rafikisms-openapi.json"',
    },
  });
}
