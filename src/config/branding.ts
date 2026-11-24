/**
 * Brand values needed before `astro:env` exists.
 *
 * `astro.config.mjs` generates the favicon PNG/ICO files in a build hook and
 * needs the site's initial and its theme colour to do it — but it cannot
 * import `site.config.ts`, which reads `astro:env/server` and so cannot be
 * loaded at config time. Same constraint as `site-url.ts`, same answer: keep
 * the values in a plain module both sides import, so they cannot drift.
 *
 * Change them here. `site.config.ts` reads from this file.
 */
export const SITE_NAME = 'AI & Cyber Exchange';

/** Browser toolbar colour, and the fill behind the favicon letter. */
export const THEME_COLOR = '#0083fe';

/**
 * Square image the favicons are drawn from, relative to the project root.
 * Set it and every icon (favicon.svg/.ico/.png, the Apple touch icon and the
 * PWA icons) is resized from this file; leave it empty to draw the site's
 * initial on THEME_COLOR instead. Keep it at least 512px square, since the
 * largest icon is 512px. It lives in src/ because it is a build input, not a
 * file the site serves.
 */
export const FAVICON_SOURCE = 'src/assets/branding/favicon-source.png';
