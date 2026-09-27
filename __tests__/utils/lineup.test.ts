import { formationGrid, FORMATIONS, pitchRows, shortName } from '@/utils';

import type { LineupPlayer } from '@/types/api';

const player = (name: string, grid: string | null): LineupPlayer => ({
  _id: name,
  _teamId: 1,
  name,
  number: 1,
  position: 'M',
  photo: '',
  grid,
});

describe('pitchRows', () => {
  it('orders rows from the attack down to the goalkeeper', () => {
    const rows = pitchRows([
      player('Keeper', '1:1'),
      player('Striker', '3:1'),
      player('Defender', '2:1'),
    ]);

    expect(rows.map((row) => row[0]!.name)).toEqual([
      'Striker',
      'Defender',
      'Keeper',
    ]);
  });

  it('orders a row by descending column', () => {
    const [row] = pitchRows([
      player('A', '2:1'),
      player('B', '2:3'),
      player('C', '2:2'),
    ]);

    expect(row!.map((p) => p.name)).toEqual(['B', 'C', 'A']);
  });

  it('drops players without a grid position', () => {
    expect(pitchRows([player('Sub', null), player('Bad', 'x')])).toEqual([]);
  });
});

describe('shortName', () => {
  it('returns the last word of the name', () => {
    expect(shortName(' Юрій  Герета ')).toBe('Герета');
  });

  it('returns a single-word name as is', () => {
    expect(shortName('Talles')).toBe('Talles');
  });
});

describe('formationGrid', () => {
  it('lists the goalkeeper and every line position', () => {
    expect(formationGrid('4-4-2')).toEqual([
      '1:1',
      '2:1',
      '2:2',
      '2:3',
      '2:4',
      '3:1',
      '3:2',
      '3:3',
      '3:4',
      '4:1',
      '4:2',
    ]);
  });

  it('has eleven places for every offered formation', () => {
    Object.keys(FORMATIONS).forEach((formation) =>
      expect(formationGrid(formation)).toHaveLength(11),
    );
  });

  it('is empty for an unknown formation', () => {
    expect(formationGrid('9-9')).toEqual([]);
  });
});
