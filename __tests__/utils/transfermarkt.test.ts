import { findTransfermarktPlayer, parseTransfermarktSquad } from '@/utils';

const row = (number: string, name: string, height: string) => `
  <tr class="odd">
    <td class="zentriert rueckennummer"><div class=rn_nummer>${number}</div></td>
    <td class="posrela"><table class="inline-table"><tr>
      <td class="hauptlink"><a href="/p/profil/spieler/1"> ${name} </a></td>
    </tr></table></td>
    <td class="zentriert">23 февр. 1997 г. (29)</td>
    <td class="zentriert">${height}</td>
    <td class="zentriert">правая</td>
  </tr>`;

const HTML = `<table>${row('30', 'Gautier Larsonneur', '1,81м')}${row('33', 'Marten-Chris Paalberg', '1,88m')}${row('9', 'New Signing', '')}</table>`;

describe('parseTransfermarktSquad', () => {
  it('reads name, shirt number and height in cm from each row', () => {
    expect(parseTransfermarktSquad(HTML)).toEqual([
      { name: 'Gautier Larsonneur', number: 30, height: 181 },
      { name: 'Marten-Chris Paalberg', number: 33, height: 188 },
      { name: 'New Signing', number: 9, height: undefined },
    ]);
  });

  it('returns no players when the page has no table rows', () => {
    expect(parseTransfermarktSquad('<p>Blocked</p>')).toEqual([]);
  });
});

describe('findTransfermarktPlayer', () => {
  const players = parseTransfermarktSquad(HTML);

  it('matches by name ignoring accents and case', () => {
    expect(
      findTransfermarktPlayer(players, {
        name: 'GAUTIER Lársonneur',
        number: 1,
      }),
    ).toMatchObject({ height: 181 });
  });

  it('falls back to the shirt number when the names differ', () => {
    expect(
      findTransfermarktPlayer(players, { name: 'Marten Paalberg', number: 33 }),
    ).toMatchObject({ height: 188 });
  });

  it('returns undefined when neither name nor number matches', () => {
    expect(
      findTransfermarktPlayer(players, { name: 'Someone Else', number: 0 }),
    ).toBeUndefined();
  });
});
