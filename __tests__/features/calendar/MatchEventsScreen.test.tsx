import { apiOk, render } from '@tests/test-utils';
import { useLocalSearchParams } from 'expo-router';

import { eventsApi } from '@/api';

import type { ClubEvent } from '@/types/api';

import { MatchEventsScreen } from '@/features/calendar';

const event = (id: string, fixture: number | null): ClubEvent => ({
  _id: id,
  type: 'club',
  kind: 'party',
  time: 0,
  title: `Event ${id}`,
  location: '',
  fixture,
  members: [{}, {}],
});

beforeEach(() => {
  jest.mocked(useLocalSearchParams).mockReturnValue({ id: '7' });
});

describe('MatchEventsScreen', () => {
  it('lists only the events of this match with their members', async () => {
    jest
      .spyOn(eventsApi, 'clubList')
      .mockResolvedValue(apiOk({ events: [event('a', 7), event('b', 8)] }));
    const { findAllByText, getAllByText } = render(<MatchEventsScreen />);

    // Only event "a" belongs to match 7; rows show the kind name.
    expect(await findAllByText('events.kind.party')).toHaveLength(1);
    expect(getAllByText('events.members')).toHaveLength(1);
  });

  it('shows the empty state when the match has no events', async () => {
    jest.spyOn(eventsApi, 'clubList').mockResolvedValue(apiOk({ events: [] }));
    const { findByText } = render(<MatchEventsScreen />);

    expect(await findByText('events.emptyText')).toBeTruthy();
  });
});
