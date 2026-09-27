// Backend group "profile" — the signed-in fan.

/** `GET profile/` — flat user object (shape taken from the apidoc + old app). */
export type Profile = {
  _id: string;
  name?: string | null;
  surname?: string | null;
  patronymic?: string | null;
  email: string;
  phone?: string | null;
  role: string;
  smallPhoto?: string | null;
  origPhoto?: string | null;
};

export type LoyaltyLevel = 'bronze' | 'silver' | 'gold' | 'emerald';

/**
 * Loyalty status for the fan card.
 * TODO(backend): no endpoint yet — mocked in `profileApi.fanLevel`.
 */
export type FanLevel = {
  level: LoyaltyLevel;
  points: number;
  /** Points needed for the next level; `null` at the top level. */
  nextLevelPoints: number | null;
  /** Printed under the barcode. */
  cardId: string;
  /** e.g. "2025/2026". */
  season: string;
};
