// Backend group "votes" — "player of the match". Needs an activated account.

import type { Player } from './players';

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
