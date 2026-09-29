// Backend group "predictions" — score prediction for a match.

export type MakePredictionRequest = {
  fixture: number;
  /** Goals predicted for our club. */
  friend: number;
  /** Goals predicted for the opponent. */
  enemy: number;
};

/** A pick: goals for our club (`friend`) and for the opponent (`enemy`). */
export type PredictionPick = { friend: number; enemy: number };

export type PredictionResponse = {
  /** All fans' picks for the match with their shares. */
  prediction: {
    total?: number;
    votes: (PredictionPick & { total: number; percent: number })[];
  };
  /** The signed-in fan's own pick, `null` until they vote. */
  yourVote: PredictionPick | null;
};

/**
 * Sponsor odds shown after a prediction is sent.
 * TODO(backend): no endpoint yet — mocked in `predictionsApi.odds`.
 */
export type MatchOdds = {
  /** Sponsor name, matched against the sponsors list for the logo. */
  sponsor: string;
  odds: { label: string; value: string }[];
};
