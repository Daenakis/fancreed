import { useState } from 'react';
import {
  Image,
  type ImageSourcePropType,
  type LayoutRectangle,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Skeleton } from '../Skeleton';
import type { RemoteImageProps } from './types';

type Size = { width: number; height: number };

const remoteUri = (source: ImageSourcePropType) =>
  !Array.isArray(source) &&
  typeof source === 'object' &&
  source?.uri &&
  /^https?:/.test(source.uri)
    ? source.uri
    : undefined;

/** `cover` sizing that keeps the picture's top edge in the box. */
const coverTop = (picture: Size, box: Size) => {
  const scale = Math.max(
    box.width / picture.width,
    box.height / picture.height,
  );
  const width = picture.width * scale;
  return {
    position: 'absolute' as const,
    top: 0,
    left: (box.width - width) / 2,
    width,
    height: picture.height * scale,
  };
};

/**
 * Image from the internet: a pulsing skeleton fills its box until it loads
 * (and stays, still, if it fails). Size the box with `style`. `position="top"`
 * crops a `cover` picture from the bottom only, so heads stay in view.
 *
 * @example
 * <RemoteImage source={{ uri: news.image }} position="top" style={styles.cover} />
 */
export function RemoteImage({
  source,
  resizeMode = 'cover',
  position = 'center',
  style,
  onLoad,
  onError,
  accessibilityLabel,
  ...props
}: RemoteImageProps) {
  const uri = remoteUri(source);
  const [state, setState] = useState<'loading' | 'loaded' | 'failed'>(
    uri ? 'loading' : 'loaded',
  );
  const [picture, setPicture] = useState<Size | null>(null);
  const [box, setBox] = useState<LayoutRectangle | null>(null);

  // A new picture starts loading again.
  const [shownUri, setShownUri] = useState(uri);
  if (uri !== shownUri) {
    setShownUri(uri);
    setState(uri ? 'loading' : 'loaded');
    setPicture(null);
  }

  const anchorTop = position === 'top' && resizeMode === 'cover';
  const topFit = anchorTop && picture && box ? coverTop(picture, box) : null;

  return (
    <View
      style={[styles.box, style]}
      onLayout={anchorTop ? (e) => setBox(e.nativeEvent.layout) : undefined}
      accessible={!!accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: state === 'loading' }}
    >
      <Image
        {...props}
        source={source}
        resizeMode={topFit ? 'stretch' : resizeMode}
        style={topFit ?? StyleSheet.absoluteFill}
        onLoad={(event) => {
          const { width, height } = event.nativeEvent.source ?? {};
          if (anchorTop && width && height) setPicture({ width, height });
          setState('loaded');
          onLoad?.(event);
        }}
        onError={(event) => {
          setState('failed');
          onError?.(event);
        }}
      />
      {state === 'loaded' ? null : (
        <Skeleton still={state === 'failed'} style={styles.skeleton} />
      )}
    </View>
  );
}

RemoteImage.displayName = 'RemoteImage';

const styles = StyleSheet.create({
  box: {
    overflow: 'hidden',
  },
  // Fills the box, which clips it to the image's own corners.
  skeleton: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 0,
  },
});
