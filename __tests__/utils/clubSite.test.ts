import { clubSiteSeasons, parseClubPlayer, parseClubSquad } from '@/utils';

const SITE = 'https://www.asse.fr/en/';

const card = (slug: string, number: string, first: string, last: string) => `
  <a href="club/saison-2026-2027/effectif/${slug}" title="Voir la fiche" class="unslide col-12">
    <div class="infos">
      <div class="numero">${number}</div>
      <div class="nom"><small>${first}</small><br/>${last}</div>
      <div class="pays"><img src="https://www.asse.fr/img/content/flags/France.png" alt="Drapeau France"> France</div>
    </div>
    <div style="background:url(https://www.asse.fr/img/effectifs/${slug}.png)" class="bg_joueur"></div>
  </a>`;

const SQUAD_HTML = `
  <h3>Goalkeepers</h3>${card('larsonneur-gautier-j740', '30', 'Gautier', 'Larsonneur')}
  <h3>Defenders</h3>${card('lavallee-lucas-j1221', '', 'Lucas', 'Lavall&eacute;e')}
  <h3>Attackers</h3>${card('old-ben-j11', '11', 'Ben', 'Old')}`;

describe('clubSiteSeasons', () => {
  it('returns this season then the last one when the date is from July', () => {
    expect(clubSiteSeasons(new Date(2026, 6, 1))).toEqual([
      'saison-2026-2027',
      'saison-2025-2026',
    ]);
  });

  it('returns the season that began last year when the date is before July', () => {
    expect(clubSiteSeasons(new Date(2027, 5, 30))[0]).toBe('saison-2026-2027');
  });
});

describe('parseClubSquad', () => {
  it('reads every player card with its position from the heading above it', () => {
    const { players, _teamId } = parseClubSquad(SQUAD_HTML, SITE);

    expect(_teamId).toBe(1063);
    expect(players.map((p) => p.position)).toEqual([
      'Goalkeeper',
      'Defender',
      'Attacker',
    ]);
    expect(players[0]).toEqual({
      _id: 'larsonneur-gautier-j740',
      _teamId: 1063,
      id: 740,
      name: 'Gautier Larsonneur',
      number: 30,
      position: 'Goalkeeper',
      photo: 'https://www.asse.fr/img/effectifs/larsonneur-gautier-j740.png',
      ruhLink: `${SITE}club/saison-2026-2027/effectif/larsonneur-gautier-j740`,
    });
  });

  it('uses 0 when a player has no shirt number yet', () => {
    expect(parseClubSquad(SQUAD_HTML, SITE).players[1]?.number).toBe(0);
  });

  it('returns no players when the page has no cards', () => {
    expect(parseClubSquad('<h1>Not found</h1>', SITE).players).toEqual([]);
  });
});

describe('parseClubPlayer', () => {
  it('reads the birth date as ISO and the nationality', () => {
    const html = `
      <tr><td class="intitule">Birth date</td><td>23/02/1997 à Saint-Renan</td></tr>
      <tr><td class="intitule">Nationality</td><td> France</td></tr>`;

    expect(parseClubPlayer(html)).toEqual({
      birthday: '1997-02-23',
      nationality: 'France',
    });
  });

  it('returns empty values when the rows are missing', () => {
    expect(parseClubPlayer('<p></p>')).toEqual({
      birthday: '',
      nationality: '',
    });
  });
});
