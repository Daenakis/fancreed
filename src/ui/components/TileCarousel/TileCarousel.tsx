import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Carousel } from '../Carousel';
import { Icon } from '../Icon';
import { ImageCard } from '../ImageCard';
import type { TileCarouselProps, TileItem } from './types';

const ADD_KEY = '__add__';

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
  pageSize = 3,
  hideCaptions = false,
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

  return (
    <Carousel
      data={pages}
      itemWidthRatio={0.95}
      gap={0}
      keyExtractor={(_, index) => String(index)}
      style={style}
      renderItem={(page) => (
        <View style={styles.page}>
          {page.map((tile) =>
            tile === ADD_KEY ? (
              <Pressable
                key={ADD_KEY}
                accessibilityRole="button"
                accessibilityLabel={addLabel}
                onPress={onAdd}
                style={({ pressed }) => [styles.add, pressed && styles.pressed]}
              >
                <Icon name="plus" size={40} color={theme.colors[textColor]} />
              </Pressable>
            ) : (
              <ImageCard
                key={tile.key}
                variant="tile"
                image={tile.image}
                title={tile.title}
                hideCaption={hideCaptions}
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
  pressed: {
    opacity: 0.7,
  },
}));
