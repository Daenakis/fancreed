// Backend group "predictions" — score prediction for a match.

export type MakePredictionRequest = {
  fixture: number;
  /** Goals predicted for our club. */
  friend: number;
  /** Goals predicted for the opponent. */
  enemy: number;
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
