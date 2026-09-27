import type { Fixture } from '@/types/api';

export type MatchPhase = 'upcoming' | 'live' | 'finished' | 'postponed';

const LIVE = new Set([
  'First Half',
  'Halftime',
  'Second Half',
  'Extra Time',
  'Break Time',
  'Penalty In Progress',
]);

/** Groups the backend status into what the UI cares about. */
export function matchPhase(status: string): MatchPhase {
  if (status === 'Match Finished') return 'finished';
  if (status === 'Match Postponed' || status === 'Match Cancelled')
    return 'postponed';
  if (LIVE.has(status)) return 'live';
  return 'upcoming'; // "Not Started", "Time to be defined"
}

export type Countdown = { days: number; hours: number; minutes: number };

/** Time left until `date`; all zeros once it has passed. */
export function countdownTo(date: string, now = Date.now()): Countdown {
  const totalMinutes = Math.max(
    0,
    Math.floor((new Date(date).getTime() - now) / 60_000),
  );
  return {
    days: Math.floor(totalMinutes / (60 * 24)),
    hours: Math.floor(totalMinutes / 60) % 24,
    minutes: totalMinutes % 60,
  };
}

/** "Regular Season - 19" → "19"; other rounds are returned as they are. */
export function roundNumber(round: string): string {
  return round.match(/-\s*(\d+)$/)?.[1] ?? round;
}

/**
 * Which fixture to open first: the next one once the last match was more
 * than a day ago (the old app's rule), otherwise the last played one.
 */
export function initialMatchIndex(fixtures: Fixture[], now = Date.now()) {
  const first = fixtures[0];
  if (!first || fixtures.length < 2) return 0;
  const dayAgo = now - 24 * 60 * 60 * 1000;
  return new Date(first.event_date).getTime() < dayAgo ? 1 : 0;
}
