import siteConfig from '@/config/site.config';
import { defaultLocale, localizedPath } from '@/i18n';

export interface CtaLink {
  href: string;
  external: boolean;
}

const isExternal = (href: string) => /^(https?:)?\/\//.test(href);

/**
 * Where "Join the Community" leads, from `siteConfig.community.joinUrl`.
 * An internal path is locale-prefixed; an external URL is returned as-is and
 * flagged so the link can open in a new tab.
 */
export function getJoinLink(locale: string = defaultLocale): CtaLink {
  const href = siteConfig.community.joinUrl;
  if (isExternal(href)) return { href, external: true };
  return { href: localizedPath(href, locale), external: false };
}

/** The Present With Us page for a locale. */
export function getPresentLink(locale: string = defaultLocale): CtaLink {
  return { href: localizedPath('/present', locale), external: false };
}

/** The contact form with a topic preselected, e.g. `present`. */
export function getContactLink(topic: string, locale: string = defaultLocale): CtaLink {
  return {
    href: `${localizedPath('/contact', locale)}?topic=${encodeURIComponent(topic)}#message`,
    external: false,
  };
}
