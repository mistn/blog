// Constants
const THEME = "theme";
const LIGHT = "light";
const DARK = "dark";

// Initial color scheme
// Can be "light", "dark", or empty string for system's prefers-color-scheme
const initialColorScheme = "";

function getPreferTheme(): string {
  // get theme data from local storage (user's explicit choice)
  const currentTheme = localStorage.getItem(THEME);
  if (currentTheme) return currentTheme;

  // return initial color scheme if it is set (site default)
  if (initialColorScheme) return initialColorScheme;

  // return user device's prefer color scheme (system fallback)
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK
    : LIGHT;
}

// Use existing theme value from inline script if available, otherwise detect
let themeValue = window.theme?.themeValue ?? getPreferTheme();
let isThemeTransitionRunning = false;

function setPreference(): void {
  localStorage.setItem(THEME, themeValue);
  reflectPreference();
}

function applyThemePreference(nextTheme: string): void {
  themeValue = nextTheme;
  window.theme?.setTheme(themeValue);
  setPreference();
}

async function toggleThemeWithTransition(event?: Event): Promise<void> {
  if (isThemeTransitionRunning) return;

  const nextTheme = themeValue === LIGHT ? DARK : LIGHT;
  const transitionEvent = event as MouseEvent | undefined;
  const supportsViewTransition =
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    typeof transitionEvent?.clientX === "number" &&
    typeof transitionEvent?.clientY === "number" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!supportsViewTransition) {
    applyThemePreference(nextTheme);
    return;
  }

  isThemeTransitionRunning = true;

  const endRadius = Math.hypot(
    Math.max(transitionEvent.clientX, window.innerWidth - transitionEvent.clientX),
    Math.max(transitionEvent.clientY, window.innerHeight - transitionEvent.clientY)
  );

  const root = document.documentElement;
  const transitionClass =
    nextTheme === DARK ? "theme-transition-dark" : "theme-transition-light";

  root.style.setProperty("--theme-transition-x", `${transitionEvent.clientX}px`);
  root.style.setProperty("--theme-transition-y", `${transitionEvent.clientY}px`);
  root.style.setProperty("--theme-transition-radius", `${endRadius}px`);
  root.classList.remove("theme-transition-dark", "theme-transition-light");
  root.classList.add(transitionClass);
  root.setAttribute("data-theme-switching", "true");

  try {
    const transition = (document as Document & {
      startViewTransition: (callback: () => void | Promise<void>) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    }).startViewTransition(() => {
      applyThemePreference(nextTheme);
    });

    await transition.ready;
    await transition.finished;
  } catch {
    applyThemePreference(nextTheme);
  } finally {
    root.classList.remove("theme-transition-dark", "theme-transition-light");
    root.removeAttribute("data-theme-switching");
    isThemeTransitionRunning = false;
  }
}

function reflectPreference(): void {
  document.firstElementChild?.setAttribute("data-theme", themeValue);

  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);

  // Get a reference to the body element
  const body = document.body;

  // Check if the body element exists before using getComputedStyle
  if (body) {
    // Get the computed styles for the body element
    const computedStyles = window.getComputedStyle(body);

    // Get the background color property
    const bgColor = computedStyles.backgroundColor;

    // Set the background color in <meta theme-color ... />
    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);
  }
}

// Update the global theme API
if (window.theme) {
  window.theme.setPreference = setPreference;
  window.theme.reflectPreference = reflectPreference;
} else {
  window.theme = {
    themeValue,
    setPreference,
    reflectPreference,
    getTheme: () => themeValue,
    setTheme: (val: string) => {
      themeValue = val;
    },
  };
}

// Ensure theme is reflected (in case body wasn't ready when inline script ran)
reflectPreference();

function setThemeFeature(): void {
  // set on load so screen readers can get the latest value on the button
  reflectPreference();

  // now this script can find and listen for clicks on the control
  const themeButton = document.querySelector("#theme-btn") as HTMLButtonElement | null;
  if (!themeButton) return;

  themeButton.onclick = event => {
    void toggleThemeWithTransition(event);
  };
}

// Set up theme features after page load
setThemeFeature();

// Runs on view transitions navigation
document.addEventListener("astro:after-swap", setThemeFeature);

// Set theme-color value before page transition
// to avoid navigation bar color flickering in Android dark mode
document.addEventListener("astro:before-swap", event => {
  const astroEvent = event;
  const bgColor = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");

  if (bgColor) {
    astroEvent.newDocument
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);
  }
});

// sync with system changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    themeValue = isDark ? DARK : LIGHT;
    window.theme?.setTheme(themeValue);
    setPreference();
  });
