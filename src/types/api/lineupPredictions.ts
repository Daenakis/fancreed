// Backend group "lineupPredictions".

/** A player as the fan picked them for a place of the formation. */
export type PredictedPlayer = {
  /** "row:column", row 1 = goalkeeper. */
  grid: string;
  name: string;
  number?: number;
  photo?: string;
};

export type LineupPrediction = {
  _id: string;
  _teamId: number;
  fixture: number;
  /** e.g. "4-4-2". */
  formation: string;
  players: PredictedPlayer[];
};

export type LineupPredictionResponse = {
  /** The fan's own prediction, `null` until they make one. */
  prediction: LineupPrediction | null;
};

export type MakeLineupPredictionRequest = {
  fixture: number;
  formation: string;
  players: PredictedPlayer[];
};
