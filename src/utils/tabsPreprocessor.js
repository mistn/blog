import { marked } from "marked";

const TAB_BLOCK_RE = /(?<!\S)::::[ \t]*tabs[ \t]*\n([\s\S]*?)::::/g;
const TAB_ITEM_RE = /^:::[ \t]*tab-item[ \t]+(.+)$/gm;

function escapeAttr(str) {
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function transformTabs(markdown) {
  if (!markdown || !markdown.includes(":::")) return markdown;

  return markdown.replace(TAB_BLOCK_RE, (match, inner) => {
    const items = [];
    let m;
    const r = new RegExp(TAB_ITEM_RE, "gm");
    while ((m = r.exec(inner)) !== null) {
      items.push({ title: m[1].trim(), start: m.index + m[0].length, end: inner.length });
      if (items.length > 1) {
        items[items.length - 2].end = m.index;
      }
    }

    if (items.length === 0) return match;

    const tabs = items.map(item => {
      let raw = inner.slice(item.start, item.end);
      raw = raw.replace(/\n:::[ \t]*$/m, "").trim();
      return { title: item.title, html: marked.parse(raw, { async: false }) };
    });

    return buildTabHTML(tabs);
  });
}

function buildTabHTML(tabs) {
  const id = "t" + Math.random().toString(36).slice(2, 8);
  const lines = [];

  lines.push(`<my-tabs id="${id}" class="tabs" data-tabs="${id}">`);

  for (let i = 0; i < tabs.length; i++) {
    lines.push(`  <my-tab title="${escapeAttr(tabs[i].title)}"${i === 0 ? " active" : ""}>`);
    lines.push(tabs[i].html);
    lines.push("  </my-tab>");
  }

  lines.push("</my-tabs>");
  return lines.join("\n");
}
