import { pitchRows, shortName } from '@/utils';

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
