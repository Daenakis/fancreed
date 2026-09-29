import type { Player } from '@/types/api';

const normalize = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]+/g, ' ')
    .trim();

/** "G. Larsonneur" → "larsonneur", "J. Le Cardinal" → "le cardinal". */
const surname = (name: string) =>
  normalize(name.replace(/^(\p{L}\.\s*)+/u, ''));

/** Whether an api-football name ("G. Larsonneur") is the club's full name. */
const sameSurname = (apiName: string, fullName: string) => {
  const last = surname(apiName);
  const full = normalize(fullName);
  return !!last && (full === last || full.endsWith(` ${last}`));
};

type Named = Pick<Player, 'name' | 'number'>;

/** The one match by surname; the shirt number settles a shared surname. */
const pick = <T extends Named>(matches: T[], number: number) =>
  matches.length > 1 ? matches.find((p) => p.number === number) : matches[0];

/**
 * The club site's photo of a backend (api-football) player: matched by
 * surname, shirt number breaking ties. Nothing for a player the club no
 * longer lists.
 */
export function clubSquadPhoto(
  player: Named,
  squad: (Named & Pick<Player, 'photo'>)[] | undefined,
): string | undefined {
  const matches = (squad ?? []).filter((p) => sameSurname(player.name, p.name));
  return pick(matches, player.number)?.photo || undefined;
}

/**
 * The backend's (api-football) headshot of a club-site player, the other way
 * round from `clubSquadPhoto`. Nothing when the backend doesn't list them.
 */
export function backendSquadPhoto(
  player: Named,
  squad: (Named & Pick<Player, 'photo'>)[] | undefined,
): string | undefined {
  const matches = (squad ?? []).filter((p) => sameSurname(p.name, player.name));
  return pick(matches, player.number)?.photo || undefined;
}

/**
 * Best photo of a backend player and the one to fall back to if it fails to
 * load: the club-maintained photo, else the club site's, else api-football's.
 * No `image` means none at all: show a placeholder.
 */
export function playerPhoto(
  player: Pick<Player, 'name' | 'number' | 'photo' | 'actualPhoto'>,
  squad: Pick<Player, 'name' | 'number' | 'photo'>[] | undefined,
): { image?: string; fallback?: string } {
  const apiPhoto = player.photo || undefined;
  const image = player.actualPhoto || clubSquadPhoto(player, squad) || apiPhoto;
  return { image, fallback: image !== apiPhoto ? apiPhoto : undefined };
}
