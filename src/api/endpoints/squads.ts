import { type AxiosResponse, isAxiosError } from 'axios';

import { clubSiteSeasons, parseClubSquad } from '@/utils';

import type * as T from '@/types/api';

import { CONFIG } from '@/config';

import { siteClient } from '../client';

/** Squad page of the current season, or the previous one until it's up. */
async function fetchSquadPage(): Promise<AxiosResponse<string>> {
  const [current, previous] = clubSiteSeasons(new Date());
  const page = (season?: string) =>
    siteClient.get<string>(`club/${season}/effectif-professionnel`);
  try {
    return await page(current);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return page(previous);
    }
    throw error;
  }
}

/**
 * Backend group "squads" (`squads/actual`), read from the club site for now:
 * the backend still holds the old club's players.
 * TODO(backend): back to `squads/actual` once it serves the ASSE squad.
 */
export const squadsApi = {
  /** The club's current squad. */
  actual: async (): Promise<AxiosResponse<T.ActualSquadResponse>> => {
    const response = await fetchSquadPage();
    const squad = parseClubSquad(response.data, CONFIG.LINKS.CLUB_SITE);
    return { ...response, data: { squad } };
  },
} as const;
