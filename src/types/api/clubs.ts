// Backend group "clubs" — fan clubs. Needs an activated account.

export type ClubLogoUpload = {
  /** "image/jpeg" or "image/jpg". */
  mimeType: string;
  /** Image in base64. */
  data: string;
};

export type CreateClubRequest = {
  name: string;
  /** Anyone can join (`true`) or friends & family only. */
  opened: boolean;
  visible: boolean;
  description: string;
  address: string;
  coords?: { latitude: number; longitude: number };
  facebook?: string;
  instagram?: string;
  telegram?: string;
  /** Sent with create by the old app; not in the apidoc. */
  logo?: ClubLogoUpload;
};
