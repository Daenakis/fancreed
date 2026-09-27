import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

import type { ColorToken } from '@/ui/theme';

export type TileItem = {
  key: string;
  title: string;
  /** URL or local image; a placeholder is shown when missing. */
  image?: string | ImageSourcePropType | null;
};

export type TileCarouselProps<T extends TileItem> = {
  items: T[];
  onPressItem: (item: T) => void;
  /** Adds a "+" tile at the end, e.g. "create a fan club". */
  onAdd?: () => void;
  /** Screen-reader name of the "+" tile. */
  addLabel?: string;
  /** Tiles per page. Defaults to 3. */
  pageSize?: number;
  /** Tile frame background. Defaults to `translucentSurface`. */
  tileSurface?: ColorToken;
  /** Theme colour of the captions. Defaults to `foreground`. */
  textColor?: ColorToken;
  style?: StyleProp<ViewStyle>;
};
