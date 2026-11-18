// Appearance and accessibility settings: light/dark mode, text size, a more
// readable font, higher contrast, and reduced motion.
// Settings live in this browser (localStorage "auntiececi:appearance") and are
// applied as attributes on <html>, which the stylesheet below reads.

export const APPEARANCE_DEFAULTS = { theme: "system", textSize: "default", readableFont: false, highContrast: false, reduceMotion: false, cookingText: "normal" };
const KEY = "auntiececi:appearance";

// Cups and °F in the US (and a few others), metric everywhere else, until the person picks.
const defaultUnits = () => {
  const loc = (typeof navigator !== "undefined" && navigator.language) || "en-US";
  return /-(US|LR|MM)$/i.test(loc) ? "us" : "metric";
};

export function loadAppearance() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { saved = {}; }
  return { ...APPEARANCE_DEFAULTS, units: defaultUnits(), ...saved };
}

const systemDark = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
export const resolvedTheme = (a) => (a.theme === "dark" || (a.theme === "system" && systemDark()) ? "dark" : "light");

export function applyAppearance(a) {
  if (typeof document === "undefined") return;
  const h = document.documentElement;
  h.dataset.msTheme = resolvedTheme(a);
  h.dataset.msText = a.textSize;
  h.dataset.msFont = a.readableFont ? "readable" : "default";
  h.dataset.msContrast = a.highContrast ? "high" : "normal";
  h.dataset.msMotion = a.reduceMotion ? "reduce" : "normal";
  h.dataset.msCookText = a.cookingText === "large" ? "large" : "normal";
  h.style.colorScheme = h.dataset.msTheme;
}

export function saveAppearance(a) {
  try { localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* storage blocked */ }
  applyAppearance(a);
}

// Follow the device when "Match device" is chosen.
export function watchSystemTheme(getAppearance) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const fn = () => { const a = getAppearance(); if (a.theme === "system") applyAppearance(a); };
  mq.addEventListener ? mq.addEventListener("change", fn) : mq.addListener(fn);
  return () => (mq.removeEventListener ? mq.removeEventListener("change", fn) : mq.removeListener(fn));
}

export const APPEARANCE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Lobster&display=swap');
:root {
  --ms-paper: #FBF5EC; --ms-card: #FFFFFF; --ms-ink: #2E1A12; --ms-ink-muted: #6E5A4E; --ms-line: #EADFCF;
  --ms-primary: #7A3B1C; --ms-primary-text: #5E2A12; --ms-sage: #F3E3CC; --ms-sage-softer: #F9F0E2;
  --ms-accent: #E9A417; --ms-accent-text: #8A5200; --ms-accent-soft: #F8E2B0; --ms-accent-softer: #FDF3DD;
  --ms-on-ink: #FFFFFF; --ms-shadow: rgba(60,20,6,0.10);
}
:root[data-ms-theme="dark"] {
  --ms-paper: #1B100B; --ms-card: #281912; --ms-ink: #F5EADC; --ms-ink-muted: #BCA593; --ms-line: #4A3428;
  --ms-primary: #D9925A; --ms-primary-text: #F2BE8F; --ms-sage: #4A2E1F; --ms-sage-softer: #352218;
  --ms-accent: #F0B429; --ms-accent-text: #F7CC6E; --ms-accent-soft: #4E3914; --ms-accent-softer: #3A2A12;
  --ms-on-ink: #1B100B; --ms-shadow: rgba(0,0,0,0.5);
}
:root[data-ms-contrast="high"] { --ms-ink: #1F0F08; --ms-ink-muted: #45302A; --ms-line: #8E7764; --ms-primary: #5E2A12; --ms-primary-text: #45200E; --ms-accent-text: #6A3E00; }
:root[data-ms-theme="dark"][data-ms-contrast="high"] { --ms-ink: #FFFFFF; --ms-ink-muted: #E6D6C6; --ms-line: #8A7262; --ms-primary-text: #FFD3AE; --ms-accent-text: #FFDB8A; }
html, body { background: var(--ms-paper); color: var(--ms-ink); }

/* Text size: scales the content area and the tab bar */
:root[data-ms-text="small"] .ms-screen, :root[data-ms-text="small"] .ms-tabbar, :root[data-ms-text="small"] .ms-auth-body { zoom: 0.9; }
:root[data-ms-text="large"] .ms-screen, :root[data-ms-text="large"] .ms-tabbar, :root[data-ms-text="large"] .ms-auth-body { zoom: 1.15; }
:root[data-ms-text="xl"] .ms-screen, :root[data-ms-text="xl"] .ms-tabbar, :root[data-ms-text="xl"] .ms-auth-body { zoom: 1.3; }

/* Readable font (Atkinson Hyperlegible) with a little extra spacing */
:root[data-ms-font="readable"] .ms-root, :root[data-ms-font="readable"] .ms-root * { font-family: 'Atkinson Hyperlegible', system-ui, sans-serif !important; letter-spacing: 0.01em; }
:root[data-ms-font="readable"] .ms-root p, :root[data-ms-font="readable"] .ms-root li { line-height: 1.65; }

/* Reduced motion: the setting, or the device preference */
:root[data-ms-motion="reduce"] *, :root[data-ms-motion="reduce"] *::before, :root[data-ms-motion="reduce"] *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
@media (prefers-reduced-motion: reduce) { .ms-root *, .ms-root *::before, .ms-root *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }

/* Large text on the cooking screen only */
:root[data-ms-cook-text="large"] .ms-step-text { font-size: 27px !important; line-height: 1.35 !important; }
:root[data-ms-cook-text="large"] .ms-step-detail { font-size: 18px !important; line-height: 1.45 !important; }
:root[data-ms-cook-text="large"] .ms-step-ingredients label { font-size: 17px !important; }

/* Clear focus ring for keyboard users */
.ms-root :focus-visible { outline: 3px solid var(--ms-primary) !important; outline-offset: 2px; border-radius: 8px; }
.ms-skip { position: absolute; left: 12px; top: -60px; z-index: 50; background: var(--ms-ink); color: var(--ms-on-ink); padding: 8px 14px; border-radius: 10px; font-size: 14px; text-decoration: none; }
.ms-skip:focus { top: 12px; }

`;

export function injectAppearanceCss() {
  if (typeof document === "undefined" || document.getElementById("ms-appearance-css")) return;
  const el = document.createElement("style");
  el.id = "ms-appearance-css";
  el.textContent = APPEARANCE_CSS;
  document.head.appendChild(el);
}
