// Light/dark switch icon, shown solid like a system toggle:
// a crescent moon while the app is light (tap for dark), a sun while it's dark (tap for light).
import React from "react";

export function ThemeIcon({ dark, size = 20, color = "currentColor" }) {
  return dark ? (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ display: "block" }}>
      <circle cx="12" cy="12" r="4.6" fill={color} />
      <g stroke={color} strokeWidth="2.2" strokeLinecap="round">
        <path d="M12 1.8v2.4" /><path d="M12 19.8v2.4" /><path d="M1.8 12h2.4" /><path d="M19.8 12h2.4" />
        <path d="m4.8 4.8 1.7 1.7" /><path d="m17.5 17.5 1.7 1.7" /><path d="m4.8 19.2 1.7-1.7" /><path d="m17.5 6.5 1.7-1.7" />
      </g>
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ display: "block" }}>
      <path d="M11.4 2.6a7.4 7.4 0 0 0 10 10A9.6 9.6 0 1 1 11.4 2.6Z" fill={color} />
    </svg>
  );
}
