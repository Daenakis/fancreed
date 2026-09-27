import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import type { TabBarButtonProps } from './types';

/**
 * One bottom-tab button: icon only, green when active. The line above the
 * active tab is drawn (and animated) by the tab bar; this keeps its space.
 * Use as the child of `<TabTrigger asChild>` — it receives `isFocused`.
 */
export function TabBarButton({
  icon,
  activeIcon,
  label,
  isFocused: focusedTab = false,
  inactive = false,
  style,
  ...props
}: TabBarButtonProps) {
  const isFocused = focusedTab && !inactive;
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
      <View style={styles.indicatorSpace} />
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
  indicatorSpace: {
    height: 3,
  },
}));
