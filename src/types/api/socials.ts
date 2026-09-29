// Backend group "socials" — the club's social links.

export type SocialEntry = {
  _id: string;
  /** e.g. "facebook", "instagram", "twitter" (X), "tiktok", "web", "youtube". */
  name: string;
  url: string;
  image?: string;
};

export type SocialsListResponse = {
  socials: SocialEntry[];
};
