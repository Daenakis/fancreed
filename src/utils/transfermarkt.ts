// Player heights from the Transfermarkt squad page ("detailed" view), which
// the club site lacks. Temporary, like `clubSite.ts`.
import type { Player } from '@/types/api';

import { htmlToText } from './html';

export type TransfermarktPlayer = {
  name: string;
  number: number;
  /** cm; `undefined` when not listed. */
  height?: number;
};

/** Rows of the detailed squad table (`kader/verein/<id>/saison_id/<year>/plus/1`). */
export function parseTransfermarktSquad(html: string): TransfermarktPlayer[] {
  return html
    .split(/<tr class="(?:odd|even)">/)
    .slice(1)
    .map((row) => {
      const name = htmlToText(
        /<td class="hauptlink">\s*<a [^>]*>([\s\S]*?)<\/a>/.exec(row)?.[1] ??
          '',
      );
      const number = Number(/class=rn_nummer>(\d+)</.exec(row)?.[1]) || 0;
      const height = /<td class="zentriert">(\d)[,.](\d{2})\s*\S*<\/td>/.exec(
        row,
      );
      return {
        name,
        number,
        height: height
          ? Number(height[1]) * 100 + Number(height[2])
          : undefined,
      };
    })
    .filter((player) => player.name);
}

/** Lower case, no accents or punctuation: "Kévin Pedro" → "kevinpedro". */
const nameKey = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase();

/** The same player on Transfermarkt: by name, else by shirt number. */
export function findTransfermarktPlayer(
  players: TransfermarktPlayer[],
  player: Pick<Player, 'name' | 'number'>,
): TransfermarktPlayer | undefined {
  const key = nameKey(player.name);
  return (
    players.find((p) => nameKey(p.name) === key) ??
    (player.number
      ? players.find((p) => p.number === player.number)
      : undefined)
  );
}
