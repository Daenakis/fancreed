import { useState } from 'react';

import { getItem, setItem } from '@/utils';

const KEY = 'matchday.joined';

/**
 * Matchday events the fan joined, kept on the device.
 * TODO(backend): no join endpoint for matchday events yet.
 */
export function useMatchdayJoins() {
  const [joined, setJoined] = useState<string[]>(
    () => getItem<string[]>(KEY) ?? [],
  );

  const toggle = (id: string) => {
    const next = joined.includes(id)
      ? joined.filter((j) => j !== id)
      : [...joined, id];
    setItem(KEY, next);
    setJoined(next);
  };

  return { isJoined: (id: string) => joined.includes(id), toggle };
}
