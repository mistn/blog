(function () {
  if (customElements.get("my-tabs")) {
    // Already registered; just clean up existing instances on SPA navigation
    document.querySelectorAll("my-tabs").forEach(el => el._destroy?.());
    return;
  }

  function ensureStyle() {
    if (document.getElementById("tabs-inline-style")) return;
    const css = String.raw`
      my-tabs {
        display: block;
        margin: 1.5em 0;
        border: 1px solid var(--border);
        border-radius: 10px;
        overflow: hidden;
      }
      my-tabs .tabs-nav {
        display: flex;
        flex-wrap: wrap;
        border-bottom: 1px solid var(--border);
        background: var(--muted);
      }
      my-tabs .tabs-label {
        cursor: pointer;
        padding: 0.6em 1.05em;
        font-size: 0.92rem;
        font-weight: 500;
        line-height: 1.4;
        color: color-mix(in srgb, var(--foreground) 60%, transparent);
        background: none;
        border: none;
        outline: none;
        font-family: inherit;
        transition: color 0.15s, background-color 0.15s;
      }
      my-tabs .tabs-label:hover {
        color: var(--foreground);
        background: color-mix(in srgb, var(--background) 50%, transparent);
      }
      my-tabs .tabs-label.active {
        color: var(--foreground);
        background: var(--background);
        box-shadow: inset 0 -2px 0 var(--accent);
      }
      my-tab {
        display: none;
        padding: 1em 1.15em;
      }
      my-tab.active {
        display: block;
      }
      my-tab > :first-child {
        margin-top: 0;
      }
      my-tab > :last-child {
        margin-bottom: 0;
      }
    `;
    const style = document.createElement("style");
    style.id = "tabs-inline-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  class MyTabs extends HTMLElement {
    connectedCallback() {
      this._destroy();
      ensureStyle();

      const items = Array.from(this.querySelectorAll(":scope > my-tab"));

      const nav = document.createElement("div");
      nav.className = "tabs-nav";

      items.forEach((item, i) => {
        const label = item.getAttribute("title") || `Tab ${i + 1}`;
        const btn = document.createElement("button");
        btn.className = "tabs-label";
        btn.textContent = label;
        btn.addEventListener("click", () => this._switchTo(i));
        if (i === 0) btn.classList.add("active");
        nav.appendChild(btn);
      });

      this.prepend(nav);

      if (items.length > 0) {
        items[0].classList.add("active");
      }
    }

    disconnectedCallback() {
      this._destroy();
    }

    _destroy() {
      const nav = this.querySelector(":scope > .tabs-nav");
      if (nav) nav.remove();
    }

    _switchTo(index) {
      const items = this.querySelectorAll(":scope > my-tab");
      const labels = this.querySelectorAll(":scope > .tabs-nav > .tabs-label");
      items.forEach((el, i) => el.classList.toggle("active", i === index));
      labels.forEach((el, i) => el.classList.toggle("active", i === index));
    }
  }

  customElements.define("my-tabs", MyTabs);
  customElements.define("my-tab", class extends HTMLElement {});
})();
