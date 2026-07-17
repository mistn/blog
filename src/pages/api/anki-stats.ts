export const prerender = false;

const GIST_ID = "422fab6e44d55af1173d19f27ddb5664";
const GIST_FILENAME = "anki_stats.json";
const CACHE_TTL = 10 * 60 * 1000;

interface CacheEntry {
  data: unknown;
  ts: number;
}

let cache: CacheEntry | null = null;

async function fetchAnkiStats() {
  const token = import.meta.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "miuo-blog",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, { headers });
  if (!gistRes.ok) {
    if (gistRes.status === 403) throw new Error("GitHub API rate limited, add GITHUB_TOKEN env var");
    throw new Error(`GitHub API ${gistRes.status}`);
  }
  const gist = await gistRes.json();
  const file = gist.files?.[GIST_FILENAME];
  if (!file?.raw_url) throw new Error(`File "${GIST_FILENAME}" not found in gist`);

  const dataRes = await fetch(file.raw_url);
  if (!dataRes.ok) throw new Error(`Raw fetch ${dataRes.status}`);
  return dataRes.json();
}

export async function GET() {
  const now = Date.now();
  if (cache && now - cache.ts < CACHE_TTL) {
    return new Response(JSON.stringify(cache.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    const data = await fetchAnkiStats();
    cache = { data, ts: now };
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
        "X-Cache": "MISS",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
