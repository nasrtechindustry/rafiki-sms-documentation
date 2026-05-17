import { getOpenApiYaml } from '@/lib/apiSpec';

export const dynamic = 'force-static';

export function GET() {
  return new Response(getOpenApiYaml(), {
    headers: {
      'Content-Type': 'application/yaml; charset=utf-8',
      'Content-Disposition': 'attachment; filename="rafikisms-openapi.yaml"',
    },
  });
}
