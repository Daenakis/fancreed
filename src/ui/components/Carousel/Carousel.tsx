import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
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
  autoPlayMs,
  onIndexChange,
  style,
}: CarouselProps<T>) {
  const { width } = useWindowDimensions();
  // Read once: a changed `initialIndex` must not jump a list the user swiped.
  const [startIndex] = useState(initialIndex);
  const [index, setIndex] = useState(initialIndex);
  const listRef = useRef<FlatList<T>>(null);
  const [dragging, setDragging] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const itemWidth = Math.round(width * itemWidthRatio);
  const step = itemWidth + gap;
  const sidePadding = (width - itemWidth) / 2;

  useEffect(() => {
    if (!autoPlayMs) return;
    void AccessibilityInfo.isScreenReaderEnabled().then(setScreenReader);
    const sub = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReader,
    );
    return () => sub.remove();
  }, [autoPlayMs]);

  // Auto-play: one step per timeout, restarted on every page change.
  useEffect(() => {
    if (!autoPlayMs || dragging || screenReader || data.length < 2) return;
    const id = setTimeout(() => {
      const next = index + 1 < data.length ? index + 1 : 0;
      listRef.current?.scrollToOffset({ offset: step * next, animated: true });
      setIndex(next);
      onIndexChange?.(next);
    }, autoPlayMs);
    return () => clearTimeout(id);
  }, [
    autoPlayMs,
    dragging,
    screenReader,
    data.length,
    index,
    step,
    onIndexChange,
  ]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setDragging(false);
    const next = Math.round(e.nativeEvent.contentOffset.x / step);
    const clamped = Math.max(0, Math.min(next, data.length - 1));
    if (clamped === index) return;
    setIndex(clamped);
    onIndexChange?.(clamped);
  };

  return (
    <View style={style}>
      <FlatList
        ref={listRef}
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
        onScrollBeginDrag={() => setDragging(true)}
        onScrollEndDrag={() => setDragging(false)}
        onMomentumScrollEnd={onScrollEnd}
        // Not initialScrollIndex: it ignores the side padding and lands off-centre.
        contentOffset={{ x: step * startIndex, y: 0 }}
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
