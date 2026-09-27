import { useTranslation } from 'react-i18next';
import { Image, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import type { FanShopBannerProps } from './types';

/** Full-width fan-shop promo; without a picture a green titled block. */
export function FanShopBanner({ image, onPress, style }: FanShopBannerProps) {
  const { t } = useTranslation();
  const source = typeof image === 'string' ? { uri: image } : image;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('home.fanShop')}
      onPress={onPress}
      style={({ pressed }) => [styles.banner, pressed && styles.pressed, style]}
    >
      {source ? (
        <Image source={source} resizeMode="cover" style={styles.image} />
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
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  pressed: {
    opacity: 0.8,
  },
}));
