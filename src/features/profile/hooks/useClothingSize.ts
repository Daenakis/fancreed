import { useState } from 'react';

import { getItem, setItem } from '@/utils';

export const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;
export type ClothingSize = (typeof CLOTHING_SIZES)[number];

const KEY = 'profile.clothingSize';

/**
 * The fan's clothing size, kept on the device.
 * TODO(backend): no profile field yet — move it to `profile/edit` once added.
 */
export function useClothingSize() {
  const [size, setSize] = useState<ClothingSize | null>(() =>
    getItem<ClothingSize>(KEY),
  );

  const save = (next: ClothingSize) => {
    setItem(KEY, next);
    setSize(next);
  };

  return [size, save] as const;
}
