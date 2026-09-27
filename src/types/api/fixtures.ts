// Backend group "fixtures" (api-football shaped matches).

import type { Player } from './players';

export type FixtureTeam = { id: number; name: string; logo: string };

export type Fixture = {
  _id: number;
  /** Our club's team id. */
  _teamId: number;
  event_date: string;
  /** e.g. "Not Started", "First Half", "Match Finished". */
  status: string;
  homeTeam: FixtureTeam;
  awayTeam: FixtureTeam;
  goalsHomeTeam: number | null;
  goalsAwayTeam: number | null;
  league: { id: number; name: string; logo: string; round: string };
  /** e.g. "Regular Season - 19". */
  round: string;
  venue?: { name: string; city: string } | null;
  /** Live details; `elapsed` = minutes played. */
  fixture?: { status: { short: string; elapsed: number | null } };
  ticketLink?: string | null;
  previewLink?: string | null;
  overviewLink?: string | null;
  photoLink?: string | null;
  videoLink?: string | null;
  /** Starting line-ups of both teams, once announced. */
  lineups?: Lineup[];
};

/** A player in a line-up; `grid` is "row:column" on the pitch (row 1 = goalkeeper). */
export type LineupPlayer = Player & { grid?: string | null };

export type Lineup = {
  team: FixtureTeam;
  /** e.g. "4-3-3". */
  formation?: string | null;
  startXI: LineupPlayer[];
  substitutes?: LineupPlayer[];
};

export type ActualFixturesResponse = {
  /** Last played match, then the upcoming ones. */
  fixtures: Fixture[];
};

export type FixtureResponse = {
  fixture: Fixture;
};

export type FixturesTableResponse = {
  /** Played matches, newest first. */
  past: Fixture[];
  /** Upcoming matches, soonest first. */
  future: Fixture[];
};
