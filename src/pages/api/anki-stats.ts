const GIST_RAW_URL = "https://gist.githubusercontent.com/mistn/422fab6e44d55af1173d19f27ddb5664/raw/anki_stats.json";

export async function GET() {
  try {
    const dataRes = await fetch(GIST_RAW_URL, {
      headers: { "User-Agent": "miuarc-blog" },
    });
    if (!dataRes.ok) throw new Error(`Raw fetch ${dataRes.status}`);
    const data = await dataRes.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
