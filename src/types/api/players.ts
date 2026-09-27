// Backend groups "players" / "squads".

export type Player = {
  _id: string;
  _teamId: number;
  id?: number;
  name: string;
  age?: number;
  number: number;
  position: string;
  photo: string;
  /** Preferred over `name`/`photo` when set (club-maintained values). */
  actualName?: string | null;
  actualPhoto?: string | null;
  /** Player page on the club site. */
  ruhLink?: string | null;
};

export type Squad = {
  _id: string;
  _teamId: number;
  players: Player[];
};

export type ActualSquadResponse = {
  squad: Squad;
};
