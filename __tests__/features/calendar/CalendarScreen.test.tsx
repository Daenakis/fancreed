import { apiOk, fireEvent, render } from '@tests/test-utils';
import { router } from 'expo-router';

import { fixturesApi } from '@/api';

import type { Fixture } from '@/types/api';

import { CalendarScreen } from '@/features/calendar';

const match = (id: number, overrides: Partial<Fixture> = {}): Fixture => ({
  _id: id,
  _teamId: 3632,
  event_date: '2030-03-01T16:00:00+00:00',
  status: 'Not Started',
  homeTeam: { id: 3632, name: `Home ${id}`, logo: '' },
  awayTeam: { id: 10, name: `Away ${id}`, logo: '' },
  goalsHomeTeam: null,
  goalsAwayTeam: null,
  league: { id: 1, name: 'UPL', logo: '', round: '' },
  round: '',
  ...overrides,
});

const played = (id: number) =>
  match(id, { status: 'Match Finished', goalsHomeTeam: 2, goalsAwayTeam: 1 });

beforeEach(() => {
  jest
    .spyOn(fixturesApi, 'table')
    .mockResolvedValue(
      apiOk({ past: [played(1)], future: [played(1), match(2)] }),
    );
});

describe('CalendarScreen', () => {
  it('lists only upcoming matches on the calendar tab', async () => {
    const { findByLabelText, queryByLabelText } = render(<CalendarScreen />);

    expect(await findByLabelText('Home 2')).toBeTruthy();
    expect(queryByLabelText('Home 1')).toBeNull();
  });

  it('switches to results', async () => {
    const { findByLabelText, getByRole } = render(<CalendarScreen />);
    await findByLabelText('Home 2');

    fireEvent.press(getByRole('tab', { name: 'calendar.results' }));

    expect(await findByLabelText('match.score')).toBeTruthy();
  });

  it('opens the events of a match', async () => {
    const { findByRole } = render(<CalendarScreen />);

    fireEvent.press(await findByRole('button', { name: 'match.events' }));

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/calendar/events/[id]',
      params: { id: 2 },
    });
  });
});
