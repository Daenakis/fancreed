import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { RemoteImage, Text } from '@/ui/components';

import { FAN_SHOP_BANNER_RATIO } from '@/constants';

import type { FanShopBannerProps } from './types';

/**
 * Full-width fan-shop promo at the picture's own proportions (with a loading
 * skeleton); without a picture a green titled block.
 */
export function FanShopBanner({ image, onPress, style }: FanShopBannerProps) {
  const { t } = useTranslation();
  const source = typeof image === 'string' ? { uri: image } : image;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('home.fanShop')}
      onPress={onPress}
      style={({ pressed }) => [
        styles.banner,
        source ? styles.picture : null,
        pressed && styles.pressed,
        style,
      ]}
    >
      {source ? (
        <RemoteImage
          source={source}
          resizeMode="cover"
          skeleton
          style={styles.image}
        />
      ) : (
        <Text variant="h3Medium" color="onBrand">
          {t('home.fanShop')}
        </Text>
      )}
    </Pressable>
  );
}

FanShopBanner.displayName = 'FanShopBanner';

const styles = StyleSheet.create((theme) => ({
  banner: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.brand,
  },
  picture: {
    height: undefined,
    aspectRatio: FAN_SHOP_BANNER_RATIO,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  pressed: {
    opacity: 0.8,
  },
}));
