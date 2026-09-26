import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, FlatList, type ViewToken } from 'react-native';

import type { SlideshowListProps } from './types';

const VIEWABILITY = { itemVisiblePercentThreshold: 60 };

/**
 * Horizontal list that advances by itself (e.g. the news carousel): moves
 * to the next item every `intervalMs`, pauses while the user touches it and
 * resumes after `resumeAfterMs`, looping back to `startIndex` at the end.
 * Doesn't auto-advance while a screen reader is on.
 *
 * @example
 * <SlideshowList data={news} renderItem={renderNews} keyExtractor={(n) => String(n.id)} />
 */
export function SlideshowList<T>({
  data,
  intervalMs = 2500,
  resumeAfterMs = 6000,
  startIndex = 0,
  reversed = false,
  onTouchStart,
  onScrollBeginDrag,
  ref,
  ...props
}: SlideshowListProps<T>) {
  const listRef = useRef<FlatList<T>>(null);
  const currentIndex = useRef(startIndex);
  // True once the end item is (mostly) on screen: the list can't scroll
  // further, so the next step loops back to the start.
  const endVisible = useRef(false);
  // Read by the viewability callback, which must stay the same function.
  const endIndex = useRef(0);
  const [paused, setPaused] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const count = data?.length ?? 0;

  useEffect(() => {
    void AccessibilityInfo.isScreenReaderEnabled().then(setScreenReader);
    const sub = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReader,
    );
    return () => sub.remove();
  }, []);

  useEffect(() => {
    endIndex.current = reversed ? 0 : count - 1;
  }, [count, reversed]);

  // Auto-advance while not paused.
  useEffect(() => {
    if (paused || screenReader || count < 2) return;
    const id = setInterval(() => {
      const next = endVisible.current
        ? startIndex
        : currentIndex.current + (reversed ? -1 : 1);
      listRef.current?.scrollToIndex({ index: next, animated: true });
      currentIndex.current = next;
      endVisible.current = false;
    }, intervalMs);
    return () => clearInterval(id);
  }, [paused, screenReader, count, intervalMs, reversed, startIndex]);

  useEffect(() => () => clearTimeout(resumeTimer.current), []);

  // Any touch pauses the slideshow; it resumes after a quiet period.
  const pause = () => {
    setPaused(true);
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), resumeAfterMs);
  };

  // Stable callback — FlatList doesn't allow changing it after mount.
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<T>[] }) => {
      const indexes = viewableItems
        .map((item) => item.index)
        .filter((index): index is number => index !== null);
      if (!indexes.length) return;
      const reversedList = endIndex.current === 0;
      currentIndex.current = reversedList
        ? Math.max(...indexes)
        : Math.min(...indexes);
      endVisible.current = indexes.includes(endIndex.current);
    },
    [],
  );

  const setRefs = (node: FlatList<T> | null) => {
    listRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <FlatList
      ref={setRefs}
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={count > startIndex ? startIndex : undefined}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={VIEWABILITY}
      onTouchStart={(e) => {
        pause();
        onTouchStart?.(e);
      }}
      onScrollBeginDrag={(e) => {
        pause();
        onScrollBeginDrag?.(e);
      }}
      // Scrolling to an item not yet measured: retry once layout catches up.
      onScrollToIndexFailed={({ index }) =>
        setTimeout(
          () => listRef.current?.scrollToIndex({ index, animated: true }),
          100,
        )
      }
      {...props}
    />
  );
}

SlideshowList.displayName = 'SlideshowList';
