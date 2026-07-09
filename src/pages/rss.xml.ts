import { SITE } from "@/config";

export async function GET() {
  const siteUrl = SITE.website.replace(/\/$/, "");
  return new Response(null, {
    status: 301,
    headers: { Location: `${siteUrl}/atom.xml` },
  });
}
