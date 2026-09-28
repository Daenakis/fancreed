import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { geocodeAddress } from '@/utils';

import { clubsApi, fetcher } from '@/api';

import { QueryKey } from '@/types';
import type { CreateClubEventRequest } from '@/types/api';

import { useApiErrorAlert } from '../../useApiErrorAlert';
import { refreshClubData } from './refreshClubData';

type CreateClubEventParams = {
  clubId: string;
  event: CreateClubEventRequest;
  /** Typed address; saved as the event's location with its coordinates. */
  address: string;
};

type ClubEventRef = { clubId: string; eventId: string };

export const createClubEventMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Clubs, 'createEvent'],
    // The backend keeps the address apart from the event and needs map
    // coordinates for it: create, geocode, then set location 0.
    mutationFn: async ({ clubId, event, address }: CreateClubEventParams) => {
      const { event: created } = await fetcher(
        clubsApi.createEvent(clubId, event),
      );
      const coords = await geocodeAddress(address);
      if (coords) {
        await fetcher(
          clubsApi.setEventLocation(clubId, created._id, {
            location: address,
            coords,
          }),
        );
      }
      return created;
    },
  });

export const joinClubEventMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Clubs, 'joinEvent'],
    mutationFn: ({ clubId, eventId }: ClubEventRef) =>
      fetcher(clubsApi.joinEvent(clubId, eventId)),
  });

export const leaveClubEventMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Clubs, 'leaveEvent'],
    mutationFn: ({ clubId, eventId }: ClubEventRef) =>
      fetcher(clubsApi.leaveEvent(clubId, eventId)),
  });

/** Creates a club event with its address and refreshes club and event data. */
export function useCreateClubEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...createClubEventMutationOptions(),
    onSuccess: () => refreshClubData(queryClient),
  });
}

/** Joins a club event and refreshes club and event data. */
export function useJoinClubEventMutation() {
  const onError = useApiErrorAlert();
  const queryClient = useQueryClient();
  return useMutation({
    ...joinClubEventMutationOptions(),
    onError,
    onSuccess: () => refreshClubData(queryClient),
  });
}

/** Leaves a club event and refreshes club and event data. */
export function useLeaveClubEventMutation() {
  const onError = useApiErrorAlert();
  const queryClient = useQueryClient();
  return useMutation({
    ...leaveClubEventMutationOptions(),
    onError,
    onSuccess: () => refreshClubData(queryClient),
  });
}
