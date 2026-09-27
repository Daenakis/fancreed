// Backend group "fixtures" (api-football shaped matches).

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
};

export type ActualFixturesResponse = {
  /** Last played match, then the upcoming ones. */
  fixtures: Fixture[];
};
