import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

export type FanShopBannerProps = {
  /** Promo picture (bundled for now). TODO(backend): no banner API yet. */
  image?: ImageSourcePropType | string | null;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};
