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

/** A fan (club owner, event owner, member). */
export type ClubPerson = {
  _id?: string;
  name?: string | null;
  surname?: string | null;
  patronymic?: string | null;
  smallPhoto?: string | null;
};

export type Club = {
  _id: string;
  name: string;
  /** Club logo URL. */
  origPhoto?: string | null;
  smallPhoto?: string | null;
  address?: string;
  description?: string;
  /** Open to anyone; `false` = friends & family (invite only). */
  opened?: boolean;
  facebook?: string | null;
  instagram?: string | null;
  telegram?: string | null;
  owner?: ClubPerson | null;
  /** Members besides the owner (old app: `totalMembers + 1` people). */
  totalMembers?: number;
  youOwner?: boolean;
  youMember?: boolean;
};

export type ClubResponse = {
  club: Club;
};

/** `POST clubs/:clubId/setphoto` — raw base64 JPEG. */
export type SetClubPhotoRequest = {
  mimeType: 'image/jpeg';
  data: string;
};

export type ClubsListResponse = {
  clubs: Club[];
};
