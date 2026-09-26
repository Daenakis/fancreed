// Backend group "leagues" (`GET leagues/list/:index`), api-football shaped.

export type StandingEntry = {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  all: { played: number; win: number; draw: number; lose: number };
};

export type League = {
  _id: number;
  /** Our club's team id in this league. */
  _teamId: number;
  league: { id: number; name: string; logo: string; season: number };
  /** One table per group; a regular league has one. */
  standings: StandingEntry[][];
};

export type LeaguesListResponse = {
  leagues: League[];
};
