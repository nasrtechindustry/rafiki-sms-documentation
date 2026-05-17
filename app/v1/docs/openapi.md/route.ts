import { getOpenApiMarkdown } from '@/lib/apiSpec';

export const dynamic = 'force-static';

export function GET() {
  return new Response(getOpenApiMarkdown(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="rafikisms-api.md"',
    },
  });
}
