import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import type { TabBarButtonProps } from './types';

/**
 * One bottom-tab button: icon only, green with a line above when active.
 * Use as the child of `<TabTrigger asChild>` — it receives `isFocused`.
 */
export function TabBarButton({
  icon,
  activeIcon,
  label,
  isFocused = false,
  style,
  ...props
}: TabBarButtonProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isFocused }}
      // Our layout last: the router's TabTrigger passes its own style.
      style={(state) => [
        typeof style === 'function' ? style(state) : style,
        styles.button,
      ]}
      {...props}
    >
      <View style={styles.indicator(isFocused)} />
      <Icon
        name={isFocused ? (activeIcon ?? icon) : icon}
        size={24}
        color={isFocused ? theme.colors.brand : theme.colors.mutedForeground}
      />
    </Pressable>
  );
}

TabBarButton.displayName = 'TabBarButton';

const styles = StyleSheet.create((theme) => ({
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: theme.spacing(2),
    gap: theme.spacing(2.5),
  },
  indicator: (active: boolean) => ({
    width: theme.spacing(12),
    height: 3,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: active ? theme.colors.brand : 'transparent',
  }),
}));
