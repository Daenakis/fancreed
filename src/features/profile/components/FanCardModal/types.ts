import type { FanCardProps } from '../FanCard';

export type FanCardModalProps = Omit<
  FanCardProps,
  'variant' | 'onPress' | 'style'
> & {
  visible: boolean;
  onClose: () => void;
};
