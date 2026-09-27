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
  /** Shown as "for-against" in the `full` table. */
  goalsFor?: number;
  goalsAgainst?: number;
};

/**
 * - `compact` (default): club logo + name, played/won/drawn/lost/points
 *   (home preview).
 * - `full`: separate rounded rows, club logo only, goals for-against instead
 *   of points (tournament screen, Figma).
 */
export type StandingsTableVariant = 'compact' | 'full';

export type StandingsTableProps = {
  rows: StandingsRowData[];
  /** Row to highlight (our club), by `teamId`. */
  highlightTeamId?: number;
  /** Defaults to `compact`. */
  variant?: StandingsTableVariant;
  style?: StyleProp<ViewStyle>;
};

export type StandingsRowProps = {
  row: StandingsRowData;
  highlighted: boolean;
  full: boolean;
};
