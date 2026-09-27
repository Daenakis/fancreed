import {
  countdownTo,
  initialMatchIndex,
  matchPhase,
  roundNumber,
} from '@/utils';

import type { Fixture } from '@/types/api';

describe('matchPhase', () => {
  it.each([
    ['Not Started', 'upcoming'],
    ['Time to be defined', 'upcoming'],
    ['First Half', 'live'],
    ['Halftime', 'live'],
    ['Match Finished', 'finished'],
    ['Match Postponed', 'postponed'],
  ])('maps "%s" to %s', (status, phase) => {
    expect(matchPhase(status)).toBe(phase);
  });
});

describe('countdownTo', () => {
  const now = Date.parse('2026-09-27T10:00:00Z');

  it('splits the time left into days, hours and minutes', () => {
    expect(countdownTo('2026-09-29T13:25:00Z', now)).toEqual({
      days: 2,
      hours: 3,
      minutes: 25,
    });
  });

  it('returns zeros once the date has passed', () => {
    expect(countdownTo('2026-09-26T10:00:00Z', now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
    });
  });
});

describe('roundNumber', () => {
  it('extracts the number from a regular-season round', () => {
    expect(roundNumber('Regular Season - 19')).toBe('19');
  });

  it('keeps other round names', () => {
    expect(roundNumber('Final')).toBe('Final');
  });
});

describe('initialMatchIndex', () => {
  const at = (date: string) => ({ event_date: date }) as Fixture;
  const now = Date.parse('2026-09-27T10:00:00Z');

  it('opens the next match when the last one was over a day ago', () => {
    expect(
      initialMatchIndex(
        [at('2026-09-20T10:00:00Z'), at('2026-10-01T10:00:00Z')],
        now,
      ),
    ).toBe(1);
  });

  it('keeps the last match while it is recent', () => {
    expect(
      initialMatchIndex(
        [at('2026-09-27T08:00:00Z'), at('2026-10-01T10:00:00Z')],
        now,
      ),
    ).toBe(0);
  });
});
