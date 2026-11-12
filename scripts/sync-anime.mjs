/* eslint-disable no-console */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ANILIST_API_URL = "https://graphql.anilist.co";
const OUTPUT_PATH = resolve("src/data/anime.generated.json");
const COMPLETED_STATUS = "COMPLETED";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;
// AniList's 429 cooldowns are commonly 30-60s, so allow the header value
// through instead of clamping it to a few seconds.
const MAX_RETRY_DELAY_MS = 90_000;

// Entries that have this custom list enabled on AniList are never published.
// Manage it in the AniList UI instead of maintaining ID allow/deny lists here.
const EXCLUDED_CUSTOM_LIST = "h-archive";

const query = `
  query AnimeCollection($userName: String) {
    MediaListCollection(
      userName: $userName
      type: ANIME
      status: COMPLETED
      sort: UPDATED_TIME_DESC
      forceSingleCompletedList: true
    ) {
      user {
        name
      }
      lists {
        entries {
          status
          customLists(asArray: true)
          startedAt {
            year
          }
          completedAt {
            year
          }
          media {
            siteUrl
            seasonYear
            startDate {
              year
            }
            title {
              native
              userPreferred
              romaji
            }
            coverImage {
              extraLarge
              large
            }
          }
        }
      }
    }
  }
`;

function readCachedOutput() {
  if (!existsSync(OUTPUT_PATH)) return null;

  try {
    return JSON.parse(readFileSync(OUTPUT_PATH, "utf8"));
  } catch (error) {
    warn(
      `Cached anime data could not be parsed and will be ignored: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
}

function warn(message) {
  console.log(`::warning::${String(message).replace(/\r?\n/g, " ")}`);
}

export function hasCustomList(rawCustomLists, targetName) {
  if (!Array.isArray(rawCustomLists)) return false;

  const normalizedTarget = String(targetName ?? "")
    .trim()
    .toLowerCase();
  if (!normalizedTarget) return false;

  return rawCustomLists.some(list => {
    const name = typeof list === "string" ? list : list?.name;
    return String(name ?? "").trim().toLowerCase() === normalizedTarget;
  });
}

export function hasEnabledCustomList(rawCustomLists, targetName) {
  if (!Array.isArray(rawCustomLists)) return false;

  const normalizedTarget = String(targetName ?? "")
    .trim()
    .toLowerCase();
  if (!normalizedTarget) return false;

  return rawCustomLists.some(list => {
    const name = typeof list === "string" ? list : list?.name;
    if (String(name ?? "").trim().toLowerCase() !== normalizedTarget) {
      return false;
    }

    // Fail closed: an object without a usable "enabled" flag counts as enabled.
    return typeof list === "object" && list !== null && "enabled" in list
      ? list.enabled !== false
      : true;
  });
}

export function isPublishableEntry(entry) {
  if (entry?.status !== COMPLETED_STATUS) return false;

  // Completed + not parked in the exclusion list is what gets published.
  return !hasEnabledCustomList(entry?.customLists, EXCLUDED_CUSTOM_LIST);
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeEntry(entry) {
  const media = entry?.media;
  const title =
    media?.title?.native || media?.title?.userPreferred || media?.title?.romaji;
  const largeCover = media?.coverImage?.large;
  const cover = media?.coverImage?.extraLarge || largeCover;
  const rawYear =
    media?.seasonYear ??
    media?.startDate?.year ??
    entry?.completedAt?.year ??
    entry?.startedAt?.year ??
    null;
  const year = Number.isInteger(rawYear) && rawYear > 0 ? rawYear : null;
  const url = media?.siteUrl;

  if (!title || !cover || !url) return null;
  if (!isHttpsUrl(cover) || !isHttpsUrl(url)) return null;

  return {
    title,
    cover,
    coverSmall:
      largeCover && largeCover !== cover && isHttpsUrl(largeCover)
        ? largeCover
        : null,
    year,
    url,
  };
}

export function buildItems(collection) {
  const entries = (collection?.lists ?? []).flatMap(
    list => list?.entries ?? []
  );
  const normalizedItems = [];
  // total: COMPLETED entries seen before the H-Archive exclusion.
  let total = 0;
  let excluded = 0;
  const hasExcludedList = entries.some(entry =>
    hasCustomList(entry?.customLists, EXCLUDED_CUSTOM_LIST)
  );

  for (const entry of entries) {
    if (entry?.status !== COMPLETED_STATUS) continue;

    total += 1;

    if (!isPublishableEntry(entry)) {
      excluded += 1;
      continue;
    }

    const item = normalizeEntry(entry);
    if (item) normalizedItems.push(item);
  }

  const dedupedItems = [];
  const seen = new Set();

  for (const item of normalizedItems) {
    const key = getEntryKey(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    dedupedItems.push(item);
  }

  dedupedItems.sort((a, b) => {
    const yearA = a.year ?? -1;
    const yearB = b.year ?? -1;
    if (yearA !== yearB) return yearB - yearA;
    const byTitle = a.title.localeCompare(b.title, "ja");
    if (byTitle !== 0) return byTitle;
    return a.url < b.url ? -1 : a.url > b.url ? 1 : 0;
  });

  return { items: dedupedItems, total, excluded, hasExcludedList };
}

function getEntryKey(item) {
  return item.url || [item.title.trim(), item.cover, item.year ?? ""].join("::");
}

export function isSameItem(cachedItem, item) {
  return (
    cachedItem?.title === item.title &&
    cachedItem?.cover === item.cover &&
    (cachedItem?.coverSmall ?? null) === (item.coverSmall ?? null) &&
    (cachedItem?.year ?? null) === (item.year ?? null) &&
    cachedItem?.url === item.url
  );
}

class RetryableHttpError extends Error {
  constructor(message, retryAfterMs) {
    super(message);
    this.name = "RetryableHttpError";
    this.retryAfterMs = retryAfterMs;
  }
}

export function getRetryAfterMs(response) {
  const header = response.headers.get("retry-after");
  if (!header) return null;

  const seconds = Number(header);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(seconds * 1000, MAX_RETRY_DELAY_MS);
  }

  // AniList may also send an HTTP-date instead of a delta in seconds.
  const dateMs = Date.parse(header);
  if (!Number.isNaN(dateMs)) {
    return Math.min(Math.max(dateMs - Date.now(), 0), MAX_RETRY_DELAY_MS);
  }

  return null;
}

export function isRetryableError(error) {
  if (error instanceof RetryableHttpError) return true;

  const name = error?.name;
  if (name === "TimeoutError" || name === "AbortError") return true;

  // fetch rejects with a TypeError for network failures.
  return error instanceof TypeError;
}

export function getRetryDelayMs(error, attempt) {
  if (error instanceof RetryableHttpError && error.retryAfterMs !== null) {
    return error.retryAfterMs;
  }

  // Back off 1s after the first failure, then 2s.
  return Math.min(attempt * 1000, MAX_RETRY_DELAY_MS);
}

const sleep = ms => new Promise(done => setTimeout(done, ms));

async function requestCollection(userName) {
  const response = await fetch(ANILIST_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        userName,
      },
    }),
    // Covers reading the body as well as the response headers.
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const message = `AniList request failed with ${response.status}.`;

    // Free the socket / surface a useful body if the server sent one.
    try {
      await response.body?.cancel();
    } catch {
      // Ignore cleanup failures.
    }

    if (
      response.status === 408 ||
      response.status === 429 ||
      response.status >= 500
    ) {
      throw new RetryableHttpError(message, getRetryAfterMs(response));
    }

    throw new Error(message);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    const message = payload.errors.map(error => error.message).join("; ");
    throw new Error(`AniList returned an error: ${message}`);
  }

  const collection = payload.data?.MediaListCollection;
  if (!collection?.user?.name || !Array.isArray(collection.lists)) {
    throw new Error("AniList returned an unexpected payload shape.");
  }

  return collection;
}

async function fetchAnimeCollection(userName) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return await requestCollection(userName);
    } catch (error) {
      if (!isRetryableError(error) || attempt === MAX_ATTEMPTS) throw error;

      const message = error instanceof Error ? error.message : String(error);
      const delayMs = getRetryDelayMs(error, attempt);
      warn(
        `AniList request failed (attempt ${attempt}/${MAX_ATTEMPTS}): ${message} Retrying in ${delayMs}ms.`
      );
      await sleep(delayMs);
    }
  }

  throw new Error("AniList request failed after all retry attempts.");
}

export function shouldKeepEmptyResult(cachedCount, nextCount, allowEmpty) {
  return cachedCount > 0 && nextCount === 0 && !allowEmpty;
}

export function shouldKeepShrunkResult(cachedCount, nextCount, allowShrink) {
  return (
    cachedCount > 0 &&
    nextCount > 0 &&
    nextCount * 2 <= cachedCount &&
    !allowShrink
  );
}

export function shouldKeepMissingListResult(
  total,
  hasExcludedList,
  allowMissingList
) {
  return total > 0 && !hasExcludedList && !allowMissingList;
}

async function main() {
  const userName = process.env.ANILIST_USER_NAME?.trim();

  // Validate configuration before any fetch so the cache fallback cannot hide it.
  if (!userName) {
    throw new Error("ANILIST_USER_NAME must be set in environment variables.");
  }

  // Read the cache once and reuse it for both the fallback and the comparison.
  const cached = readCachedOutput();

  let collection;

  try {
    collection = await fetchAnimeCollection(userName);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // Only transient failures fall back to cache. Config/schema errors
    // (bad username, 404, GraphQL error, unexpected payload) must surface.
    if (cached && isRetryableError(error)) {
      warn(`AniList sync failed, keeping cached anime data: ${message}`);
      return;
    }

    throw error;
  }

  const username = collection.user.name;

  if (
    cached?.username &&
    cached.username.toLowerCase() !== username.toLowerCase() &&
    process.env.ALLOW_USER_CHANGE !== "1"
  ) {
    warn(
      `AniList returned "${username}" but the cache belongs to "${cached.username}". Keeping cached data. Set ALLOW_USER_CHANGE=1 to accept the account change.`
    );
    return;
  }

  const { items, total, excluded, hasExcludedList } = buildItems(collection);

  // Fail closed if the exclusion list vanished (renamed/removed on AniList).
  if (
    shouldKeepMissingListResult(
      total,
      hasExcludedList,
      process.env.ALLOW_MISSING_ARCHIVE_LIST === "1"
    )
  ) {
    warn(
      `The "${EXCLUDED_CUSTOM_LIST}" custom list was not found on any entry; it may have been renamed or removed. Keeping cached data. Set ALLOW_MISSING_ARCHIVE_LIST=1 to sync without it.`
    );
    return;
  }

  if (total > 0 && hasExcludedList && excluded === 0) {
    console.log(
      `No completed entries are currently in the "${EXCLUDED_CUSTOM_LIST}" custom list.`
    );
  }

  const cachedItems = Array.isArray(cached?.items) ? cached.items : [];
  const cachedCount = cachedItems.length;

  if (
    shouldKeepEmptyResult(
      cachedCount,
      items.length,
      process.env.ALLOW_EMPTY_SYNC === "1"
    )
  ) {
    warn(
      `AniList returned no publishable entries (${total} completed, ${excluded} excluded); keeping the cached ${cachedCount} entries. Set ALLOW_EMPTY_SYNC=1 to accept an empty result.`
    );
    return;
  }

  if (
    shouldKeepShrunkResult(
      cachedCount,
      items.length,
      process.env.ALLOW_SHRINK_SYNC === "1"
    )
  ) {
    warn(
      `AniList returned ${items.length} entries, down from ${cachedCount} cached entries (50% or more lost); keeping cached data. Set ALLOW_SHRINK_SYNC=1 to accept the shrink.`
    );
    return;
  }

  const isSame =
    Array.isArray(cached?.items) &&
    typeof cached.updatedAt === "string" &&
    cached.username === username &&
    cached.items.length === items.length &&
    cached.items.every((item, index) => isSameItem(item, items[index]));

  const output = {
    username,
    updatedAt: isSame ? cached.updatedAt : new Date().toISOString(),
    items,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  const tempPath = `${OUTPUT_PATH}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  renameSync(tempPath, OUTPUT_PATH);

  console.log(
    `Synced ${output.items.length} unique completed anime entries to ${OUTPUT_PATH}`
  );
}

const isDirectRun =
  Boolean(process.argv[1]) &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectRun) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    // Let pending handles close naturally; process.exit() can trip libuv
    // assertions on Windows when a fetch timeout is still pending.
    process.exitCode = 1;
  });
}
