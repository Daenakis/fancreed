import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import { Share } from 'react-native';

import { fixturesApi, predictionsApi } from '@/api';

import type { Fixture } from '@/types/api';

import { PredictionBlock } from '@/features/gamification';

const OUR_TEAM = 3632;

const fixture = (
  id: number,
  status: string,
  home: number,
  away: number,
): Fixture => ({
  _id: id,
  _teamId: OUR_TEAM,
  event_date: '2026-10-01T16:00:00+00:00',
  status,
  homeTeam: { id: home, name: `Team ${home}`, logo: `https://x/${home}.png` },
  awayTeam: { id: away, name: `Team ${away}`, logo: `https://x/${away}.png` },
  goalsHomeTeam: null,
  goalsAwayTeam: null,
  league: { id: 333, name: 'UPL', logo: 'https://x/l.png', round: '20' },
});

const mockFixtures = (fixtures: Fixture[]) =>
  jest.spyOn(fixturesApi, 'actual').mockResolvedValue(apiOk({ fixtures }));

// Picks: first arrow press starts at 0, then +1 per press.
const pick = (
  utils: ReturnType<typeof render>,
  label: string,
  presses: number,
) => {
  const picker = utils.getByRole('adjustable', { name: label });
  for (let i = 0; i < presses; i += 1) {
    fireEvent(picker, 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
  }
};

describe('PredictionBlock', () => {
  it('shows the next (not started) match', async () => {
    mockFixtures([
      fixture(1, 'Match Finished', OUR_TEAM, 10),
      fixture(2, 'Not Started', 20, OUR_TEAM),
    ]);
    const { findByText } = render(<PredictionBlock />);

    expect(await findByText('Team 20')).toBeTruthy();
  });

  it('keeps Send disabled until both scores are picked', async () => {
    mockFixtures([fixture(2, 'Not Started', OUR_TEAM, 20)]);
    const utils = render(<PredictionBlock />);

    const send = await utils.findByRole('button', { name: 'prediction.send' });
    expect(send).toBeDisabled();
  });

  it('sends our goals as friend when we play away, then offers Share', async () => {
    mockFixtures([fixture(2, 'Not Started', 20, OUR_TEAM)]);
    const make = jest
      .spyOn(predictionsApi, 'make')
      .mockResolvedValue(apiOk(undefined));
    const share = jest
      .spyOn(Share, 'share')
      .mockResolvedValue({ action: 'sharedAction' });
    const utils = render(<PredictionBlock />);
    await utils.findByText('Team 20');

    pick(utils, 'prediction.homeGoals', 2); // home (opponent) → 1
    pick(utils, 'prediction.awayGoals', 3); // away (us) → 2
    fireEvent.press(utils.getByRole('button', { name: 'prediction.send' }));

    await waitFor(() =>
      expect(make).toHaveBeenCalledWith({ fixture: 2, friend: 2, enemy: 1 }),
    );
    fireEvent.press(
      await utils.findByRole('button', { name: 'prediction.share' }),
    );
    expect(share).toHaveBeenCalled();
  });

  it('renders nothing when there is no upcoming match', async () => {
    mockFixtures([fixture(1, 'Match Finished', OUR_TEAM, 10)]);
    const { toJSON } = render(<PredictionBlock />);

    await waitFor(() => expect(toJSON()).toBeNull());
  });
});
