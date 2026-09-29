import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Carousel } from '../Carousel';
import { Icon } from '../Icon';
import { ImageCard } from '../ImageCard';
import type { TileCarouselProps, TileItem } from './types';

const ADD_KEY = '__add__';
/** Side of a `square` tile, as ImageCard's. */
const SQUARE = 100;

/**
 * Small image tiles in swipeable pages (3 per page by default) with page
 * dots, e.g. partners, fan clubs, events. `onAdd` appends a "+" tile.
 *
 * @example
 * <TileCarousel items={partners} onPressItem={openPartner} />
 */
export function TileCarousel<T extends TileItem>({
  items,
  onPressItem,
  onAdd,
  addLabel,
  variant = 'tile',
  pageSize = 3,
  hideCaptions = false,
  placeholderIcon,
  textColor = 'foreground',
  tileSurface,
  style,
}: TileCarouselProps<T>) {
  const { theme } = useUnistyles();
  const tiles: (T | typeof ADD_KEY)[] = onAdd ? [...items, ADD_KEY] : items;
  const pages: (T | typeof ADD_KEY)[][] = [];
  for (let i = 0; i < tiles.length; i += pageSize) {
    pages.push(tiles.slice(i, i + pageSize));
  }

  if (!pages.length) return null;

  const square = variant === 'square';

  return (
    <Carousel
      data={pages}
      itemWidthRatio={0.95}
      // Pages as wide as their tiles, so the next page's first tile peeks.
      itemWidth={
        square
          ? pageSize * SQUARE + (pageSize - 1) * theme.spacing(2)
          : undefined
      }
      align={square ? 'start' : 'center'}
      gap={square ? theme.spacing(2) : 0}
      keyExtractor={(_, index) => String(index)}
      style={style}
      renderItem={(page) => (
        <View style={[styles.page, square && styles.squarePage]}>
          {page.map((tile) =>
            tile === ADD_KEY ? (
              <Pressable
                key={ADD_KEY}
                accessibilityRole="button"
                accessibilityLabel={addLabel}
                onPress={onAdd}
                style={({ pressed }) => [
                  styles.add,
                  square && styles.squareAdd,
                  pressed && styles.pressed,
                ]}
              >
                <Icon name="plus" size={40} color={theme.colors[textColor]} />
              </Pressable>
            ) : (
              <ImageCard
                key={tile.key}
                variant={variant}
                image={tile.image}
                title={tile.title}
                hideCaption={hideCaptions}
                placeholderIcon={placeholderIcon}
                textColor={textColor}
                tileSurface={tileSurface}
                onPress={() => onPressItem(tile)}
              />
            ),
          )}
        </View>
      )}
    />
  );
}

TileCarousel.displayName = 'TileCarousel';

const styles = StyleSheet.create((theme) => ({
  page: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing(3),
  },
  squarePage: {
    justifyContent: 'flex-start',
    gap: theme.spacing(2),
  },
  add: {
    width: 100,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
  },
  squareAdd: {
    width: SQUARE,
    height: SQUARE,
    borderRadius: theme.radius.md,
  },
  pressed: {
    opacity: 0.7,
  },
}));
