export const prerender = false;

const API_BASE = "https://api.uptimerobot.com/v2/getMonitors";
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours
const STATUS_DAYS = 30;
const DAY = 86400;

interface CacheEntry {
  data: unknown;
  ts: number;
}

let cache: CacheEntry | null = null;
let refreshing: Promise<unknown> | null = null;

function getDateRanges() {
  const now = Math.floor(Date.now() / 1000);
  const ranges: string[] = [];
  for (let i = STATUS_DAYS - 1; i >= 0; i--) {
    const start = Math.floor((now - (i + 1) * DAY) / DAY) * DAY;
    const end = start + DAY;
    ranges.push(`${start}_${end}`);
  }
  const overall = `${ranges[0].split("_")[0]}_${ranges[ranges.length - 1].split("_")[1]}`;
  ranges.push(overall);
  return ranges.join("-");
}

async function fetchPage(apiKey: string, offset: number) {
  const ranges = getDateRanges();
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      api_key: apiKey,
      format: "json",
      all_time_uptime_ratio: "1",
      custom_uptime_ranges: ranges,
      response_times: "1",
      response_times_limit: "24",
      response_times_average: "30",
      offset: String(offset),
      limit: "50",
    }).toString(),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("UptimeRobot rate limited");
    throw new Error(`UptimeRobot HTTP ${res.status}`);
  }

  const data = await res.json();
  if (data.stat !== "ok") throw new Error(data.error?.message || "API error");
  return data;
}

async function fetchAllMonitors(apiKey: string) {
  const firstPage = await fetchPage(apiKey, 0);
  const all = [...firstPage.monitors];
  const { pagination } = firstPage;

  if (all.length < pagination.total) {
    const promises: Promise<unknown>[] = [];
    for (let offset = pagination.limit; offset < pagination.total; offset += pagination.limit) {
      promises.push(fetchPage(apiKey, offset));
    }
    const pages = await Promise.all(promises);
    for (const p of pages as { monitors: unknown[] }[]) {
      all.push(...p.monitors);
    }
  }

  return all;
}

async function refreshCache(apiKey: string) {
  const data = await fetchAllMonitors(apiKey);
  cache = { data, ts: Date.now() };
  return data;
}

export async function GET() {
  const apiKey = import.meta.env.UPROBOT_API_KEY || import.meta.env.PUBLIC_UPROBOT_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const now = Date.now();
  const isFresh = cache && (now - cache.ts < CACHE_TTL);

  // stale-while-revalidate: return stale, refresh in background
  if (cache && !isFresh && !refreshing) {
    refreshing = refreshCache(apiKey).finally(() => { refreshing = null; });
  }

  // return cached data if available
  if (cache) {
    return new Response(JSON.stringify(cache.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=604800",
        "X-Cache": isFresh ? "HIT" : "STALE",
      },
    });
  }

  // cache miss — must wait for fresh data
  try {
    const data = await refreshCache(apiKey);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=604800",
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
