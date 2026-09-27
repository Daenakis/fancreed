import type { AppEvent } from '@/types/api';

/** Event start as a Date (the backend sends ISO or unix seconds). */
export function eventDate(time: AppEvent['time']): Date {
  return typeof time === 'number' ? new Date(time * 1000) : new Date(time);
}

/**
 * Universal maps link (opens Apple / Google Maps) for the event:
 * by coordinates when known, otherwise by address.
 */
export function mapsUrl(event: Pick<AppEvent, 'coords' | 'location'>): string {
  const query = event.coords
    ? `${event.coords.latitude},${event.coords.longitude}`
    : event.location;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** "17 березня, 16:00" — day, month and time in the app language. */
export function formatEventDate(date: Date, language: string): string {
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
