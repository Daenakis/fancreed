// Backend group "predictions" — score prediction for a match.

export type MakePredictionRequest = {
  fixture: number;
  /** Goals predicted for our club. */
  friend: number;
  /** Goals predicted for the opponent. */
  enemy: number;
};
