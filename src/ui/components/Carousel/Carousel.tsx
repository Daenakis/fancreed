import { useState } from 'react';
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { SliderIndicator } from '../SliderIndicator';
import type { CarouselProps } from './types';

/**
 * Swipeable pages, one centred item per page with the neighbours peeking,
 * and page dots underneath (e.g. video thumbnails, player votes).
 *
 * @example
 * <Carousel
 *   data={videos}
 *   keyExtractor={(v) => v.id}
 *   renderItem={(v) => <VideoThumb video={v} />}
 * />
 */
export function Carousel<T>({
  data,
  renderItem,
  keyExtractor,
  itemWidthRatio = 0.8,
  gap = 12,
  showIndicator = true,
  indicatorColor = 'brand',
  initialIndex = 0,
  onIndexChange,
  style,
}: CarouselProps<T>) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(initialIndex);
  const itemWidth = Math.round(width * itemWidthRatio);
  const step = itemWidth + gap;
  const sidePadding = (width - itemWidth) / 2;

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / step);
    const clamped = Math.max(0, Math.min(next, data.length - 1));
    if (clamped === index) return;
    setIndex(clamped);
    onIndexChange?.(clamped);
  };

  return (
    <View style={style}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: sidePadding, gap }}
        keyExtractor={keyExtractor}
        renderItem={({ item, index: i }) => (
          <View style={{ width: itemWidth }}>{renderItem(item, i)}</View>
        )}
        onMomentumScrollEnd={onScrollEnd}
        // Not initialScrollIndex: it ignores the side padding and lands off-centre.
        contentOffset={{ x: step * initialIndex, y: 0 }}
        getItemLayout={(_, i) => ({ length: step, offset: step * i, index: i })}
      />
      {showIndicator && data.length > 1 ? (
        <SliderIndicator
          count={data.length}
          active={index}
          activeColor={indicatorColor}
          style={styles.indicator}
        />
      ) : null}
    </View>
  );
}

Carousel.displayName = 'Carousel';

const styles = StyleSheet.create((theme) => ({
  indicator: {
    alignSelf: 'center',
    marginTop: theme.spacing(3),
  },
}));
