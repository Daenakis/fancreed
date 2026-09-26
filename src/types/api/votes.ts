// Backend group "votes" — "player of the match". Needs an activated account.

export type Player = {
  _id: string;
  _teamId: number;
  name: string;
  number: number;
  position: string;
  photo: string;
  /** Preferred over `name`/`photo` when set (club-maintained values). */
  actualName?: string | null;
  actualPhoto?: string | null;
};

export type Vote = {
  _id: string;
  _teamId: number;
  player: Player;
  fixture: number;
  quantity: number;
  percent: number;
  total: number;
  /** Voting for this match is closed. */
  finished: boolean;
};

export type VotesListResponse = {
  votes: Vote[];
  youVoted: boolean;
  yourVote?: Vote | null;
};

export type MakeVoteRequest = {
  /** Vote (candidate) id. */
  id: string;
};
