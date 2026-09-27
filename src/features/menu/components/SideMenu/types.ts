import type { IconName } from '@/ui/assets/icons';

export type SideMenuProps = {
  visible: boolean;
  onClose: () => void;
};

export type MenuItem = {
  key: string;
  icon: IconName;
  label: string;
  onPress: () => void;
};
