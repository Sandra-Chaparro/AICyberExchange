import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale } from '@/i18n';

export type Session = CollectionEntry<'sessions'>;

/**
 * All sessions for a locale, falling back to the default locale when that
 * locale has none of its own. Drafts are filtered in production only, so they
 * can be previewed with `npm run dev`.
 */
export async function getSessions(locale: string = defaultLocale): Promise<Session[]> {
  const load = (l: string) =>
    getCollection(
      'sessions',
      ({ data }) => data.locale === l && (import.meta.env.PROD ? data.draft !== true : true)
    );
  const own = await load(locale);
  return own.length > 0 || locale === defaultLocale ? own : load(defaultLocale);
}

/**
 * Whether a session is still ahead. A session marked `upcoming` whose date has
 * passed counts as past, so an announcement left unedited after the day does
 * not keep advertising it. An upcoming session with no date stays upcoming.
 *
 * The site is static, so "now" is the build time: rebuild after a session to
 * move it across.
 */
export function isUpcoming(session: Session, now: Date = new Date()): boolean {
  if (session.data.status !== 'upcoming') return false;
  return !session.data.date || session.data.date.valueOf() >= now.valueOf();
}

/** Sessions still ahead, soonest first; undated announcements last. */
export function upcomingSessions(sessions: Session[], now: Date = new Date()): Session[] {
  return sessions
    .filter((s) => isUpcoming(s, now))
    .sort((a, b) => {
      const ad = a.data.date?.valueOf() ?? Infinity;
      const bd = b.data.date?.valueOf() ?? Infinity;
      return ad - bd || a.data.order - b.data.order;
    });
}

/** Sessions that have taken place, most recent first; undated ones last, by `order`. */
export function pastSessions(sessions: Session[], now: Date = new Date()): Session[] {
  return sessions
    .filter((s) => !isUpcoming(s, now))
    .sort((a, b) => {
      const ad = a.data.date?.valueOf() ?? -Infinity;
      const bd = b.data.date?.valueOf() ?? -Infinity;
      return bd - ad || a.data.order - b.data.order;
    });
}

/** Distinct presenting companies across past sessions, in archive order. */
export function participatingCompanies(sessions: Session[], now: Date = new Date()): Session[] {
  const seen = new Set<string>();
  return pastSessions(sessions, now).filter((s) => {
    const key = s.data.company.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
