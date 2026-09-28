// Squad and player bio from the club site asse.fr, which has no API: its
// squad and player pages are server-rendered HTML, parsed here into the
// shapes the app uses. Temporary — until the backend serves the ASSE squad.
import type { PlayerDetails, Squad } from '@/types/api';

import { htmlToText } from './html';

/** api-football id of AS Saint-Étienne. */
const TEAM_ID = 1063;

/** Section headings on the squad page → the positions the app knows. */
const POSITIONS: Record<string, string> = {
  Goalkeepers: 'Goalkeeper',
  Defenders: 'Defender',
  Midfielders: 'Midfielder',
  Attackers: 'Attacker',
};

/** Year the football season began: the current year from July. */
export function seasonStartYear(date: Date): number {
  return date.getMonth() >= 6 ? date.getFullYear() : date.getFullYear() - 1;
}

/**
 * Season path segments to try, newest first: "saison-2026-2027" from July,
 * then the previous one (the new season's page may not be up yet).
 */
export function clubSiteSeasons(date: Date): string[] {
  const start = seasonStartYear(date);
  return [start, start - 1].map((year) => `saison-${year}-${year + 1}`);
}

const PLAYER_CARD =
  /<a href="(club\/saison-[\d-]+\/effectif\/([a-z0-9-]+-j(\d+)))"[\s\S]*?class="numero">([^<]*)<[\s\S]*?class="nom"><small>([^<]*)<\/small><br\/>([^<]*)<[\s\S]*?url\(([^)]+)\)/g;

/** The squad page (`club/<season>/effectif-professionnel`). */
export function parseClubSquad(html: string, siteUrl: string): Squad {
  const headings = [...html.matchAll(/<h3>(\w+)<\/h3>/g)];
  const players = [...html.matchAll(PLAYER_CARD)].map((card) => {
    const [, path, slug, id, number, first, last, photo] = card;
    const heading = headings.filter((h) => h.index < card.index).pop()?.[1];
    return {
      _id: slug!,
      _teamId: TEAM_ID,
      id: Number(id),
      name: htmlToText(`${first} ${last}`),
      number: Number(number) || 0,
      position: (heading && POSITIONS[heading]) ?? '',
      photo: photo!,
      ruhLink: `${siteUrl}${path}`,
    };
  });
  return { _id: 'club-site', _teamId: TEAM_ID, players };
}

/** Value cell next to a label cell on the player page. */
const cell = (html: string, label: string) =>
  htmlToText(
    new RegExp(
      `<td class="intitule">${label}</td>\\s*<td>([\\s\\S]*?)</td>`,
    ).exec(html)?.[1] ?? '',
  );

/** Birth date and nationality from a player page ("23/02/1997 à Saint-Renan"). */
export function parseClubPlayer(html: string): PlayerDetails {
  const birth = /(\d{2})\/(\d{2})\/(\d{4})/.exec(cell(html, 'Birth date'));
  return {
    birthday: birth ? `${birth[3]}-${birth[2]}-${birth[1]}` : '',
    nationality: cell(html, 'Nationality'),
  };
}
