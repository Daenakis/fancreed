import type { StyleProp, ViewStyle } from 'react-native';

/** One team's line in the league table — display data, already localised. */
export type StandingsRowData = {
  teamId: number;
  rank: number;
  teamName: string;
  teamLogo?: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
};

export type StandingsTableProps = {
  rows: StandingsRowData[];
  /** Row to highlight (our club), by `teamId`. */
  highlightTeamId?: number;
  style?: StyleProp<ViewStyle>;
};

export type StandingsRowProps = {
  row: StandingsRowData;
  highlighted: boolean;
};
