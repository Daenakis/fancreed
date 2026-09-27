import type { AppEvent } from '@/types/api';

/** Clock-only times like "17:00" (old matchday events carry no day). */
const CLOCK = /^(\d{1,2}):(\d{2})$/;

/**
 * Event start as a Date (the backend sends ISO, unix seconds or a bare
 * "HH:mm" — the latter is placed on today, so only its time is meaningful).
 */
export function eventDate(time: AppEvent['time']): Date {
  if (typeof time === 'number') return new Date(time * 1000);
  const clock = CLOCK.exec(time);
  if (!clock) return new Date(time);
  const date = new Date();
  date.setHours(Number(clock[1]), Number(clock[2]), 0, 0);
  return date;
}

/** False for a bare "HH:mm" or an unreadable value — the day is unknown. */
export function hasEventDay(time: AppEvent['time']): boolean {
  return !CLOCK.test(String(time)) && !Number.isNaN(eventDate(time).getTime());
}

/**
 * Universal maps link (opens Apple / Google Maps) for the event:
 * by coordinates when known, otherwise by address.
 */
export function mapsUrl(event: Pick<AppEvent, 'coords' | 'location'>): string {
  // Old records may carry only a latitude — fall back to the address then.
  const { latitude, longitude } = event.coords ?? {};
  const query =
    typeof latitude === 'number' && typeof longitude === 'number'
      ? `${latitude},${longitude}`
      : event.location;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** "17 березня, 16:00" — day, month and time in the app language. */
export function formatEventDate(date: Date, language: string): string {
  // Intl throws on an invalid date; show nothing rather than crash.
  if (Number.isNaN(date.getTime())) return '';
  const day = new Intl.DateTimeFormat(language, {
    day: 'numeric',
    month: 'long',
  }).format(date);
  const time = new Intl.DateTimeFormat(language, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
  return `${day}, ${time}`;
}
