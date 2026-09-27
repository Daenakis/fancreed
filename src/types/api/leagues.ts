// Backend group "leagues" (`GET leagues/list/:index`), api-football shaped.

export type StandingEntry = {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals?: { for: number; against: number };
  };
};

export type League = {
  _id: number;
  /** Our club's team id in this league. */
  _teamId: number;
  league: {
    id: number;
    name: string;
    logo: string;
    /** Start year, e.g. 2025 for 2025/26. */
    season: number;
    /** "League" or "Cup". */
    type?: string;
  };
  /** One table per group; a regular league has one. */
  standings: StandingEntry[][];
};

export type LeaguesListResponse = {
  leagues: League[];
};
