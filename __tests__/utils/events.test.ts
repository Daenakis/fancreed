import { eventDate, formatEventDate, mapsUrl } from '@/utils';

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
});

describe('formatEventDate', () => {
  it('joins the day and the time', () => {
    expect(formatEventDate(new Date(2026, 2, 17, 16, 0), 'en')).toBe(
      'March 17, 04:00 PM',
    );
  });
});
