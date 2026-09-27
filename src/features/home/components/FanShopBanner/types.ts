import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

export type FanShopBannerProps = {
  /** Promo picture. TODO(backend): no banner API yet — a titled block shows. */
  image?: ImageSourcePropType | string | null;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};
