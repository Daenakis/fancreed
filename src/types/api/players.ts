// Backend groups "players" / "squads".

export type Player = {
  _id: string;
  _teamId: number;
  id?: number;
  name: string;
  age?: number;
  number: number;
  position: string;
  photo: string;
  /** Preferred over `name`/`photo` when set (club-maintained values). */
  actualName?: string | null;
  actualPhoto?: string | null;
  /** Player page on the club site. */
  ruhLink?: string | null;
};

export type Squad = {
  _id: string;
  _teamId: number;
  players: Player[];
};

export type ActualSquadResponse = {
  squad: Squad;
};

export type PlayerResponse = {
  player: Player;
};

/** A stat: career total plus the current season's share. */
export type PlayerStat = { total: number; season: number };

/**
 * Bio and statistics for the player page. The club site (current source)
 * has only the birth date and nationality; the rest shows when present.
 */
export type PlayerDetails = {
  /** ISO date; empty when unknown. */
  birthday: string;
  nationality: string;
  /** cm. */
  height?: number;
  /** kg. */
  weight?: number;
  /** e.g. "2024/2025". */
  season?: string;
  matches?: PlayerStat;
  goals?: PlayerStat;
  assists?: PlayerStat;
};
