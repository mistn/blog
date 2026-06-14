import { toHast } from "mdast-util-to-hast";
import { toHtml } from "hast-util-to-html";

let instanceCounter = 0;

function isTabsContainer(node) {
  return node?.type === "containerDirective" && node?.name === "tabs";
}

function isTabItemContainer(node) {
  return node?.type === "containerDirective" && node?.name === "tab-item";
}

export function remarkTabsPlugin() {
  return function (tree, file) {
    const newChildren = [];
    let i = 0;

    while (i < tree.children.length) {
      const node = tree.children[i];

      if (isTabsContainer(node)) {
        instanceCounter++;
        const id = "tab-" + instanceCounter;
        const tabItems = node.children?.filter(isTabItemContainer) || [];
        const html = buildTabsHTML(id, tabItems);
        newChildren.push({ type: "html", value: html });
      } else {
        newChildren.push(node);
      }
      i++;
    }

    tree.children = newChildren;
  };
}

function buildTabsHTML(id, tabItems) {
  const parts = [];

  parts.push(`<my-tabs id="${id}" class="tabs" data-tabs="${id}">`);

  for (let idx = 0; idx < tabItems.length; idx++) {
    const tab = tabItems[idx];
    const label = extractLabel(tab) || `Tab ${idx + 1}`;
    const active = idx === 0 ? " active" : "";

    parts.push(`  <my-tab title="${escapeAttr(label)}"${active}>`);

    for (const child of tab.children || []) {
      const hastNode = toHast(child);
      if (hastNode) {
        parts.push(toHtml(hastNode));
      }
    }

    parts.push("  </my-tab>");
  }

  parts.push("</my-tabs>");
  return parts.join("\n");
}

function extractLabel(node) {
  const attrs = node?.attributes || {};
  if (attrs.title) return attrs.title;
  if (attrs.label) return attrs.label;
  // The label may be in the text content attribute of the directive
  if (node?.data?.hProperties?.title) return node.data.hProperties.title;
  // Fallback: check if the direct children contain the label text
  if (node?.children?.length === 1 && node.children[0]?.type === "text") {
    return node.children[0].value.trim();
  }
  return null;
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
