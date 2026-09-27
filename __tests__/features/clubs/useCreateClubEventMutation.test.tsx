import { apiOk } from '@tests/test-utils';
import * as Location from 'expo-location';

import { createClubEventMutationOptions } from '@/hooks';

import { clubsApi } from '@/api';

import type { CreateClubEventRequest } from '@/types/api';

const event: CreateClubEventRequest = {
  type: 'club',
  kind: 'trip',
  title: 'Trip',
  description: 'Away game',
  startDate: 1805302800,
  endDate: 1805310000,
  opened: true,
  visible: true,
};

const run = (address: string) =>
  createClubEventMutationOptions().mutationFn!(
    { clubId: 'c1', event, address },
    undefined as never,
  );

describe('createClubEventMutationOptions', () => {
  it('creates the event, then saves the geocoded address as its location', async () => {
    jest
      .spyOn(clubsApi, 'createEvent')
      .mockResolvedValue(
        apiOk({ event: { ...event, _id: 'e1', time: 0, location: '' } }),
      );
    const setLocation = jest
      .spyOn(clubsApi, 'setEventLocation')
      .mockResolvedValue(
        apiOk({ event: { ...event, _id: 'e1', time: 0, location: '' } }),
      );
    jest
      .mocked(Location.geocodeAsync)
      .mockResolvedValue([{ latitude: 49.8, longitude: 24, accuracy: 1 }]);

    await run('Stryiska 199, Lviv');

    expect(clubsApi.createEvent).toHaveBeenCalledWith('c1', event);
    expect(setLocation).toHaveBeenCalledWith('c1', 'e1', {
      location: 'Stryiska 199, Lviv',
      coords: { latitude: 49.8, longitude: 24 },
    });
  });

  it('keeps the event without a location when the address is not found', async () => {
    jest
      .spyOn(clubsApi, 'createEvent')
      .mockResolvedValue(
        apiOk({ event: { ...event, _id: 'e2', time: 0, location: '' } }),
      );
    const setLocation = jest.spyOn(clubsApi, 'setEventLocation');
    jest.mocked(Location.geocodeAsync).mockResolvedValue([]);

    await expect(run('nowhere at all')).resolves.toMatchObject({ _id: 'e2' });
    expect(setLocation).not.toHaveBeenCalled();
  });
});
