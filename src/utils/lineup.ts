/**
 * Players (or empty slots) as pitch rows from the attack (top) down to the goalkeeper,
 * each row left to right. Uses api-football's "row:column" `grid`; players
 * without one are dropped.
 */
export function pitchRows<T extends { grid?: string | null }>(
  players: T[],
): T[][] {
  const rows = new Map<number, { column: number; player: T }[]>();
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

/** Formations offered for a line-up prediction: outfield lines, back to front. */
export const FORMATIONS: Record<string, number[]> = {
  '4-4-2': [4, 4, 2],
  '4-3-3': [4, 3, 3],
  '4-2-3-1': [4, 2, 3, 1],
  '3-5-2': [3, 5, 2],
  '4-5-1': [4, 5, 1],
  '3-4-3': [3, 4, 3],
  '5-3-2': [5, 3, 2],
};

/**
 * Pitch grid positions ("row:column") of a formation, goalkeeper first —
 * the same scheme api-football uses for real line-ups.
 */
export function formationGrid(formation: string): string[] {
  const lines = FORMATIONS[formation];
  if (!lines) return [];
  return [
    '1:1',
    ...lines.flatMap((count, i) =>
      Array.from({ length: count }, (_, c) => `${i + 2}:${c + 1}`),
    ),
  ];
}
