import { type AxiosResponse, isAxiosError } from 'axios';

import { clubSiteSeasons, parseClubSquad } from '@/utils';

import type * as T from '@/types/api';

import { CONFIG } from '@/config';

import { axiosInstance, siteClient } from '../client';

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
 * Backend group "squads". The squad itself comes from the club site (full
 * names, positions, cut-out photos); the backend's api-football squad gives
 * the headshots used on the pitch.
 */
export const squadsApi = {
  /** The club's current squad. */
  actual: async (): Promise<AxiosResponse<T.ActualSquadResponse>> => {
    const response = await fetchSquadPage();
    const squad = parseClubSquad(response.data, CONFIG.LINKS.CLUB_SITE);
    // A redesigned page parses to nobody: fail, so the saved squad stays.
    if (!squad.players.length) throw new Error('Club site squad not found');
    return { ...response, data: { squad } };
  },
  /** The backend's (api-football) squad: short names and headshots. */
  backend: () => axiosInstance.get<T.ActualSquadResponse>('squads/actual'),
} as const;
