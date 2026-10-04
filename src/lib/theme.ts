/**
 * Theme persistence contract.
 *
 * The preference lives in localStorage under THEME_KEY. The inline script
 * below runs in <head> before first paint, so a returning visitor never sees a
 * flash of the wrong theme. Dark is the default when nothing is stored.
 */
export type Theme = "dark" | "light";

export const THEME_KEY = "cyberatlas:theme";
export const THEME_EVENT = "cyberatlas:theme-change";
export const DEFAULT_THEME: Theme = "dark";

/** Must stay dependency-free: it is serialised into the document head. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark')}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();`;

export function readTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme, persist = true) {
  document.documentElement.setAttribute("data-theme", theme);
  if (persist) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* private mode / blocked storage: the theme still applies for this session */
    }
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}
