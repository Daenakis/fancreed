import type { LineupPlayer } from '@/types/api';

/**
 * Starting XI as pitch rows from the attack (top) down to the goalkeeper,
 * each row left to right. Uses api-football's "row:column" `grid`; players
 * without one are dropped.
 */
export function pitchRows(players: LineupPlayer[]): LineupPlayer[][] {
  const rows = new Map<number, { column: number; player: LineupPlayer }[]>();
  for (const player of players) {
    const [row, column] = (player.grid ?? '').split(':').map(Number);
    if (!row || !column) continue;
    rows.set(row, [...(rows.get(row) ?? []), { column, player }]);
  }
  return [...rows.entries()]
    .sort(([a], [b]) => b - a)
    .map(([, row]) =>
      row.sort((a, b) => b.column - a.column).map(({ player }) => player),
    );
}

/** Surname for tight captions: the last word of the name. */
export function shortName(name: string): string {
  return name.trim().split(/\s+/).pop() ?? name;
}
