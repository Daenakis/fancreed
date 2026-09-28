import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { clubsApi, fetcher } from '@/api';

import { QueryKey } from '@/types';
import type { SetClubPhotoRequest } from '@/types/api';

import { refreshClubData } from './refreshClubData';

export const setClubPhotoMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Clubs, 'setPhoto'],
    mutationFn: ({ id, ...photo }: SetClubPhotoRequest & { id: string }) =>
      fetcher(clubsApi.setPhoto(id, photo)),
  });

/** Uploads a club logo and refreshes club and event data. */
export function useSetClubPhotoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    ...setClubPhotoMutationOptions(),
    onSuccess: () => refreshClubData(queryClient),
  });
}
