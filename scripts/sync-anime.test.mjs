import assert from "node:assert/strict";
import test from "node:test";

import {
  buildItems,
  getRetryAfterMs,
  getRetryDelayMs,
  hasCustomList,
  hasEnabledCustomList,
  isPublishableEntry,
  isRetryableError,
  isSameItem,
  normalizeEntry,
  shouldKeepEmptyResult,
  shouldKeepMissingListResult,
  shouldKeepShrunkResult,
} from "./sync-anime.mjs";

function makeMedia(overrides = {}) {
  return {
    siteUrl: "https://anilist.co/anime/1",
    seasonYear: 2020,
    startDate: { year: 2019 },
    title: { native: "タイトル" },
    coverImage: {
      extraLarge: "https://img.example/cover-xl.jpg",
      large: "https://img.example/cover-l.jpg",
    },
    ...overrides,
  };
}

function makeEntry(overrides = {}) {
  return {
    status: "COMPLETED",
    customLists: [],
    startedAt: { year: null },
    completedAt: { year: null },
    media: makeMedia(),
    ...overrides,
  };
}

function makeCollection(entries) {
  return {
    user: { name: "tester" },
    lists: [{ entries }],
  };
}

test("hasEnabledCustomList matches string entries", () => {
  assert.equal(hasEnabledCustomList(["H-Archive"], "h-archive"), true);
  assert.equal(hasEnabledCustomList(["normal"], "h-archive"), false);
});

test("hasEnabledCustomList respects the enabled flag on objects", () => {
  assert.equal(
    hasEnabledCustomList([{ name: "H-Archive", enabled: true }], "h-archive"),
    true
  );
  assert.equal(
    hasEnabledCustomList([{ name: "H-Archive", enabled: false }], "h-archive"),
    false
  );
  assert.equal(
    hasEnabledCustomList([{ name: "H-Archive" }], "h-archive"),
    true
  );
});

test("hasEnabledCustomList ignores case and surrounding whitespace", () => {
  assert.equal(hasEnabledCustomList(["  h-ARCHIVE  "], "h-archive"), true);
  assert.equal(hasEnabledCustomList(["h-archive"], " H-Archive "), true);
});

test("hasEnabledCustomList handles missing or malformed input", () => {
  assert.equal(hasEnabledCustomList(undefined, "h-archive"), false);
  assert.equal(hasEnabledCustomList(null, "h-archive"), false);
  assert.equal(hasEnabledCustomList("H-Archive", "h-archive"), false);
  assert.equal(hasEnabledCustomList([null, 42, {}], "h-archive"), false);
  assert.equal(hasEnabledCustomList(["H-Archive"], undefined), false);
});

test("hasEnabledCustomList fails closed when enabled is not a boolean", () => {
  assert.equal(
    hasEnabledCustomList([{ name: "H-Archive", enabled: null }], "h-archive"),
    true
  );
});

test("hasCustomList finds the list even when it is disabled", () => {
  assert.equal(
    hasCustomList([{ name: "H-Archive", enabled: false }], "h-archive"),
    true
  );
  assert.equal(hasCustomList([{ name: "normal", enabled: true }], "h-archive"), false);
  assert.equal(hasCustomList(undefined, "h-archive"), false);
});

test("isPublishableEntry requires COMPLETED status", () => {
  assert.equal(isPublishableEntry(makeEntry({ status: "CURRENT" })), false);
  assert.equal(isPublishableEntry(makeEntry({ status: undefined })), false);
  assert.equal(isPublishableEntry(makeEntry()), true);
});

test("isPublishableEntry rejects entries in the H-Archive list", () => {
  assert.equal(
    isPublishableEntry(
      makeEntry({ customLists: [{ name: "H-Archive", enabled: true }] })
    ),
    false
  );
  assert.equal(
    isPublishableEntry(
      makeEntry({ customLists: [{ name: "H-Archive", enabled: false }] })
    ),
    true
  );
  assert.equal(
    isPublishableEntry(makeEntry({ customLists: ["H-Archive"] })),
    false
  );
});

test("normalizeEntry maps fields and adds coverSmall when it differs", () => {
  assert.deepEqual(normalizeEntry(makeEntry()), {
    title: "タイトル",
    cover: "https://img.example/cover-xl.jpg",
    coverSmall: "https://img.example/cover-l.jpg",
    year: 2020,
    url: "https://anilist.co/anime/1",
  });
});

test("normalizeEntry falls back through title, cover and year", () => {
  const entry = makeEntry({
    completedAt: { year: 2018 },
    media: makeMedia({
      siteUrl: "https://anilist.co/anime/2",
      seasonYear: null,
      startDate: { year: null },
      title: { native: "", userPreferred: null, romaji: "Romaji Title" },
      coverImage: { extraLarge: null, large: "https://img.example/cover-l.jpg" },
    }),
  });

  assert.deepEqual(normalizeEntry(entry), {
    title: "Romaji Title",
    cover: "https://img.example/cover-l.jpg",
    coverSmall: null,
    year: 2018,
    url: "https://anilist.co/anime/2",
  });
});

test("normalizeEntry falls back to the media start year", () => {
  const entry = makeEntry({
    media: makeMedia({
      seasonYear: null,
      startDate: { year: 2019 },
    }),
  });

  assert.equal(normalizeEntry(entry)?.year, 2019);
});

test("normalizeEntry falls back to startedAt for the year", () => {
  const entry = makeEntry({
    startedAt: { year: 2017 },
    completedAt: { year: null },
    media: makeMedia({
      seasonYear: null,
      startDate: { year: null },
    }),
  });

  assert.equal(normalizeEntry(entry)?.year, 2017);
});

test("normalizeEntry leaves coverSmall null when covers match", () => {
  const entry = makeEntry({
    media: makeMedia({
      coverImage: {
        extraLarge: "https://img.example/cover.jpg",
        large: "https://img.example/cover.jpg",
      },
    }),
  });

  assert.equal(normalizeEntry(entry)?.coverSmall, null);
});

test("normalizeEntry returns null when required fields are missing", () => {
  assert.equal(
    normalizeEntry(makeEntry({ media: makeMedia({ title: {} }) })),
    null
  );
  assert.equal(
    normalizeEntry(makeEntry({ media: makeMedia({ coverImage: {} }) })),
    null
  );
  assert.equal(
    normalizeEntry(makeEntry({ media: makeMedia({ siteUrl: null }) })),
    null
  );
  assert.equal(normalizeEntry(undefined), null);
});

test("normalizeEntry rejects non-https urls", () => {
  assert.equal(
    normalizeEntry(makeEntry({ media: makeMedia({ siteUrl: "javascript:alert(1)" }) })),
    null
  );
  assert.equal(
    normalizeEntry(
      makeEntry({ media: makeMedia({ coverImage: { extraLarge: "http://img.example/x.jpg" } }) })
    ),
    null
  );
});

test("normalizeEntry treats non-positive years as unknown", () => {
  assert.equal(
    normalizeEntry(
      makeEntry({
        completedAt: { year: 0 },
        startedAt: { year: 0 },
        media: makeMedia({ seasonYear: 0, startDate: { year: 0 } }),
      })
    )?.year,
    null
  );
});

test("buildItems filters, dedupes, sorts and counts excluded entries", () => {
  const collection = makeCollection([
    makeEntry({
      media: makeMedia({
        siteUrl: "https://anilist.co/anime/3",
        seasonYear: 2020,
        title: { native: "い" },
      }),
    }),
    makeEntry({
      status: "CURRENT",
      media: makeMedia({ siteUrl: "https://anilist.co/anime/current" }),
    }),
    makeEntry({
      customLists: [{ name: "H-Archive", enabled: true }],
      media: makeMedia({ siteUrl: "https://anilist.co/anime/hidden" }),
    }),
    makeEntry({
      media: makeMedia({
        siteUrl: "https://anilist.co/anime/1",
        seasonYear: 2020,
        title: { native: "あ" },
      }),
    }),
    makeEntry({
      media: makeMedia({
        siteUrl: "https://anilist.co/anime/1",
        seasonYear: 2020,
        title: { native: "あ" },
      }),
    }),
    makeEntry({
      media: makeMedia({
        siteUrl: "https://anilist.co/anime/4",
        seasonYear: 2022,
        title: { native: "う" },
      }),
    }),
    makeEntry({
      media: makeMedia({
        siteUrl: "https://anilist.co/anime/5",
        seasonYear: null,
        startDate: { year: null },
        title: { native: "え" },
      }),
    }),
  ]);

  const { items, total, excluded, hasExcludedList } = buildItems(collection);

  assert.equal(total, 6);
  assert.equal(excluded, 1);
  assert.equal(hasExcludedList, true);
  assert.deepEqual(
    items.map(item => item.url),
    [
      "https://anilist.co/anime/4",
      "https://anilist.co/anime/1",
      "https://anilist.co/anime/3",
      "https://anilist.co/anime/5",
    ]
  );
});

test("buildItems breaks title ties by url", () => {
  const collection = makeCollection([
    makeEntry({
      media: makeMedia({
        siteUrl: "https://anilist.co/anime/9",
        seasonYear: 2020,
        title: { native: "同じ" },
      }),
    }),
    makeEntry({
      media: makeMedia({
        siteUrl: "https://anilist.co/anime/8",
        seasonYear: 2020,
        title: { native: "同じ" },
      }),
    }),
  ]);

  assert.deepEqual(
    buildItems(collection).items.map(item => item.url),
    ["https://anilist.co/anime/8", "https://anilist.co/anime/9"]
  );
});

test("buildItems handles an empty collection", () => {
  assert.deepEqual(buildItems({ lists: [] }), {
    items: [],
    total: 0,
    excluded: 0,
    hasExcludedList: false,
  });
  assert.deepEqual(buildItems(undefined), {
    items: [],
    total: 0,
    excluded: 0,
    hasExcludedList: false,
  });
});

test("buildItems reports whether the exclusion list exists at all", () => {
  assert.equal(buildItems(makeCollection([makeEntry()])).hasExcludedList, false);
  assert.equal(
    buildItems(
      makeCollection([
        makeEntry({ customLists: [{ name: "H-Archive", enabled: false }] }),
      ])
    ).hasExcludedList,
    true
  );
});

test("shouldKeepEmptyResult only blocks non-empty caches without override", () => {
  assert.equal(shouldKeepEmptyResult(10, 0, false), true);
  assert.equal(shouldKeepEmptyResult(10, 0, true), false);
  assert.equal(shouldKeepEmptyResult(0, 0, false), false);
  assert.equal(shouldKeepEmptyResult(10, 1, false), false);
});

test("shouldKeepShrunkResult triggers at 50% loss or worse", () => {
  assert.equal(shouldKeepShrunkResult(10, 4, false), true);
  assert.equal(shouldKeepShrunkResult(10, 5, false), true);
  assert.equal(shouldKeepShrunkResult(10, 6, false), false);
  assert.equal(shouldKeepShrunkResult(10, 5, true), false);
  assert.equal(shouldKeepShrunkResult(10, 0, false), false);
});

test("shouldKeepMissingListResult fails closed only when the list is absent", () => {
  assert.equal(shouldKeepMissingListResult(10, false, false), true);
  assert.equal(shouldKeepMissingListResult(10, false, true), false);
  assert.equal(shouldKeepMissingListResult(10, true, false), false);
  assert.equal(shouldKeepMissingListResult(0, false, false), false);
});

test("getRetryAfterMs parses seconds, dates and caps the delay", () => {
  const fakeResponse = value => ({ headers: { get: () => value } });

  assert.equal(getRetryAfterMs(fakeResponse("2")), 2000);
  assert.equal(getRetryAfterMs(fakeResponse("60")), 60_000);
  assert.equal(getRetryAfterMs(fakeResponse("600")), 90_000);
  assert.equal(getRetryAfterMs(fakeResponse("abc")), null);
  assert.equal(getRetryAfterMs(fakeResponse(null)), null);

  const date = new Date(Date.now() + 5000).toUTCString();
  const dateMs = getRetryAfterMs(fakeResponse(date));
  assert.ok(dateMs >= 3000 && dateMs <= 6000, `unexpected date delay: ${dateMs}`);
});

test("getRetryDelayMs backs off 1s then 2s", () => {
  assert.equal(getRetryDelayMs(new Error("boom"), 1), 1000);
  assert.equal(getRetryDelayMs(new Error("boom"), 2), 2000);
});

test("isRetryableError only accepts transient failures", () => {
  const timeout = new Error("timed out");
  timeout.name = "TimeoutError";

  assert.equal(isRetryableError(timeout), true);
  assert.equal(isRetryableError(new TypeError("fetch failed")), true);
  assert.equal(isRetryableError(new Error("AniList request failed with 404.")), false);
});

test("isSameItem treats a missing coverSmall as null", () => {
  const item = normalizeEntry(makeEntry());
  const legacyItem = { ...item };
  delete legacyItem.coverSmall;

  assert.equal(isSameItem(legacyItem, { ...item, coverSmall: null }), true);
  assert.equal(isSameItem({ ...item, coverSmall: null }, item), false);
  assert.equal(isSameItem({ ...item, title: "changed" }, item), false);
  assert.equal(isSameItem(item, item), true);
});
