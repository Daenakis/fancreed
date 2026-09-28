import type { AxiosResponse } from 'axios';

import {
  findTransfermarktPlayer,
  parseClubPlayer,
  parseTransfermarktSquad,
  seasonStartYear,
  type TransfermarktPlayer,
} from '@/utils';

import type * as T from '@/types/api';

import { CONFIG } from '@/config';

import { siteClient } from '../client';
import { squadsApi } from './squads';

/** The squad player with this `_id` (club-site slug); rejects when absent. */
async function findPlayer(
  id: string,
): Promise<AxiosResponse<T.PlayerResponse>> {
  const response = await squadsApi.actual();
  const player = response.data.squad.players.find((p) => p._id === id);
  if (!player) throw new Error(`Player ${id} is not in the squad`);
  return { ...response, data: { player } };
}

const TRANSFERMARKT_TTL = 60 * 60 * 1000;
let transfermarkt: {
  at: number;
  players: Promise<TransfermarktPlayer[]>;
} | null = null;

/**
 * Transfermarkt's squad table, loaded once an hour for all player pages.
 * Empty when it fails — heights are extra, never a reason to fail the page.
 */
function transfermarktSquad(): Promise<TransfermarktPlayer[]> {
  if (!transfermarkt || Date.now() - transfermarkt.at > TRANSFERMARKT_TTL) {
    const players = siteClient
      .get<string>(
        `${CONFIG.LINKS.TRANSFERMARKT_SQUAD}${seasonStartYear(new Date())}`,
      )
      .then((response) => parseTransfermarktSquad(response.data))
      .catch(() => {
        transfermarkt = null;
        return [];
      });
    transfermarkt = { at: Date.now(), players };
  }
  return transfermarkt.players;
}

/**
 * Backend group "players", read from the club site for now (see `squadsApi`),
 * with heights from Transfermarkt.
 * TODO(backend): back to `players/one/:id`, plus real statistics.
 */
export const playersApi = {
  one: findPlayer,
  /** Bio from the club-site page + height from Transfermarkt (no weight or stats). */
  details: async (id: string): Promise<AxiosResponse<T.PlayerDetails>> => {
    const { player } = (await findPlayer(id)).data;
    const [response, squad] = await Promise.all([
      siteClient.get<string>(player.ruhLink!),
      transfermarktSquad(),
    ]);
    return {
      ...response,
      data: {
        ...parseClubPlayer(response.data),
        height: findTransfermarktPlayer(squad, player)?.height,
      },
    };
  },
} as const;
