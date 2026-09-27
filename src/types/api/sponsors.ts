// Backend group "sponsors" — club partners.

export type Sponsor = {
  _id: string;
  name: string;
  url: string;
  image: string;
};

export type SponsorsListResponse = {
  /** Sponsor groups; each holds a list of partners. */
  sponsors: { _id: string; sponsors: Sponsor[] }[];
};
