import { eventDate, formatEventDate, hasEventDay, mapsUrl } from '@/utils';

describe('eventDate', () => {
  it('reads unix seconds', () => {
    expect(eventDate(1_790_000_000).toISOString()).toBe(
      '2026-09-21T14:13:20.000Z',
    );
  });

  it('reads ISO strings', () => {
    expect(eventDate('2026-09-27T10:00:00Z').toISOString()).toBe(
      '2026-09-27T10:00:00.000Z',
    );
  });

  it('places a bare clock time on today', () => {
    const date = eventDate('17:05');
    expect([date.getHours(), date.getMinutes()]).toEqual([17, 5]);
    expect(date.toDateString()).toBe(new Date().toDateString());
  });
});

describe('hasEventDay', () => {
  it('is true for unix seconds and ISO strings', () => {
    expect(hasEventDay(1_790_000_000)).toBe(true);
    expect(hasEventDay('2026-09-27T10:00:00Z')).toBe(true);
  });

  it('is false for a bare clock time or garbage', () => {
    expect(hasEventDay('17:00')).toBe(false);
    expect(hasEventDay('soon')).toBe(false);
  });
});

describe('mapsUrl', () => {
  it('uses coordinates when known', () => {
    expect(
      mapsUrl({
        location: 'Arena',
        coords: { latitude: 49.77, longitude: 24.03 },
      }),
    ).toBe('https://www.google.com/maps/search/?api=1&query=49.77%2C24.03');
  });

  it('falls back to the address', () => {
    expect(mapsUrl({ location: 'Arena Lviv', coords: null })).toBe(
      'https://www.google.com/maps/search/?api=1&query=Arena%20Lviv',
    );
  });

  it('falls back to the address when a coordinate is missing', () => {
    expect(mapsUrl({ location: 'Arena', coords: { latitude: 49.77 } })).toBe(
      'https://www.google.com/maps/search/?api=1&query=Arena',
    );
  });
});

describe('formatEventDate', () => {
  it('joins the day and the time', () => {
    expect(formatEventDate(new Date(2026, 2, 17, 16, 0), 'en')).toBe(
      'March 17, 04:00 PM',
    );
  });

  it('returns an empty string for an invalid date instead of throwing', () => {
    expect(formatEventDate(new Date('soon'), 'en')).toBe('');
  });
});
