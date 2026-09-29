import { backendSquadPhoto, clubSquadPhoto, playerPhoto } from '@/utils';

const squad = [
  {
    name: 'Gautier Larsonneur',
    number: 30,
    photo: 'https://asse/larsonneur.png',
  },
  {
    name: 'Julien Le Cardinal',
    number: 26,
    photo: 'https://asse/lecardinal.png',
  },
  { name: 'Kévin Pedro', number: 23, photo: 'https://asse/pedro.png' },
  { name: 'Mathis Pedro', number: 7, photo: 'https://asse/mpedro.png' },
];

const api = (name: string, number: number) => ({
  name,
  number,
  photo: `https://api/${number}.png`,
});

describe('clubSquadPhoto', () => {
  it('matches an initial-and-surname name to the full club name', () => {
    expect(clubSquadPhoto(api('G. Larsonneur', 30), squad)).toBe(
      'https://asse/larsonneur.png',
    );
  });

  it('matches compound surnames', () => {
    expect(clubSquadPhoto(api('J. Le Cardinal', 26), squad)).toBe(
      'https://asse/lecardinal.png',
    );
  });

  it('ignores accents and case', () => {
    expect(clubSquadPhoto(api('K. PEDRO', 23), squad)).toBe(
      'https://asse/pedro.png',
    );
  });

  it('uses the shirt number when several players share the surname', () => {
    expect(clubSquadPhoto(api('M. Pedro', 7), squad)).toBe(
      'https://asse/mpedro.png',
    );
  });

  it('returns nothing when the surname is shared and no number matches', () => {
    expect(clubSquadPhoto(api('X. Pedro', 99), squad)).toBeUndefined();
  });

  it('does not match on a surname that is only part of a word', () => {
    expect(clubSquadPhoto(api('A. Sonneur', 30), squad)).toBeUndefined();
  });

  it('returns nothing without a squad', () => {
    expect(clubSquadPhoto(api('G. Larsonneur', 30), undefined)).toBeUndefined();
  });
});

describe('playerPhoto', () => {
  it('prefers the club site photo and falls back to the api one', () => {
    expect(playerPhoto(api('G. Larsonneur', 30), squad)).toEqual({
      image: 'https://asse/larsonneur.png',
      fallback: 'https://api/30.png',
    });
  });

  it('prefers a club-maintained photo over both', () => {
    expect(
      playerPhoto(
        { ...api('G. Larsonneur', 30), actualPhoto: 'https://own.png' },
        squad,
      ).image,
    ).toBe('https://own.png');
  });

  it('uses the api photo alone when the club site does not list the player', () => {
    expect(playerPhoto(api('A. Newcomer', 5), squad)).toEqual({
      image: 'https://api/5.png',
      fallback: undefined,
    });
  });

  it('has no image when there is no photo at all', () => {
    expect(
      playerPhoto({ name: 'A. Newcomer', number: 5, photo: '' }, squad),
    ).toEqual({ image: undefined, fallback: undefined });
  });
});

describe('backendSquadPhoto', () => {
  const backend = [
    api('G. Larsonneur', 30),
    api('J. Le Cardinal', 26),
    api('K. Pedro', 23),
    api('M. Pedro', 7),
  ];

  it('finds the api headshot of a club-site player', () => {
    expect(backendSquadPhoto(squad[0]!, backend)).toBe('https://api/30.png');
  });

  it('matches compound surnames and accents', () => {
    expect(backendSquadPhoto(squad[1]!, backend)).toBe('https://api/26.png');
    expect(backendSquadPhoto(squad[2]!, backend)).toBe('https://api/23.png');
  });

  it('returns nothing for a player the backend does not list', () => {
    expect(
      backendSquadPhoto({ name: 'Ada Newcomer', number: 5 }, backend),
    ).toBeUndefined();
  });

  it('returns nothing without a backend squad', () => {
    expect(backendSquadPhoto(squad[0]!, undefined)).toBeUndefined();
  });
});
