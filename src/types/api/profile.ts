// Backend group "profile" — the signed-in fan.

/** `GET profile/` — flat user object (shape taken from the apidoc + old app). */
export type Profile = {
  /** Not sent by `GET profile/` (checked on the live API). */
  _id?: string;
  name?: string | null;
  surname?: string | null;
  patronymic?: string | null;
  email: string;
  phone?: string | null;
  /** `m`, `f` or `other`. */
  sex?: ProfileSex | null;
  /** Unix time in seconds. */
  birthDay?: number | null;
  /** Player `id` (api-football) of the fan's favourite. */
  favoritePlayer?: number | null;
  role: string;
  smallPhoto?: string | null;
  origPhoto?: string | null;
};

export type ProfileSex = 'm' | 'f' | 'other';

/** `POST profile/edit` — only the sent fields change. */
export type EditProfileRequest = {
  name?: string;
  surname?: string;
  patronymic?: string;
  sex?: ProfileSex;
  birthDay?: number;
  favoritePlayer?: number;
};

/** `POST profile/setphoto` — the image as raw base64 (no data: prefix). */
export type SetPhotoRequest = {
  mimeType: 'image/jpeg';
  data: string;
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
