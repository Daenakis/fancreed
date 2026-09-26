import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type { GoalsPickerProps } from './types';

const MAX_GOALS = 9;

/** Next value for an arrow press: starts at 0, wraps 9 → 0 and 0 → 9. */
function step(value: number | null, delta: 1 | -1): number {
  if (value === null) return 0;
  return (value + delta + MAX_GOALS + 1) % (MAX_GOALS + 1);
}

/**
 * One team's goals in a score prediction: a big digit with up/down arrows.
 * Shows "?" until the first press. Two of them make "? : ?".
 *
 * @example
 * <GoalsPicker value={home} onChange={setHome} buttonsSide="left" accessibilityLabel={homeTeam} />
 */
export function GoalsPicker({
  value,
  onChange,
  buttonsSide = 'right',
  readOnly = false,
  accessibilityLabel,
  style,
}: GoalsPickerProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: value === null ? '?' : String(value) }}
      accessibilityActions={
        readOnly ? [] : [{ name: 'increment' }, { name: 'decrement' }]
      }
      onAccessibilityAction={({ nativeEvent }) =>
        onChange(step(value, nativeEvent.actionName === 'increment' ? 1 : -1))
      }
      style={[styles.row(buttonsSide), style]}
    >
      <View style={styles.count}>
        {/* Re-mounting on each value plays the entering animation. */}
        <Animated.View key={String(value)} entering={FadeInDown.duration(200)}>
          <Text variant="displaySemibold">{value === null ? '?' : value}</Text>
        </Animated.View>
      </View>
      {readOnly ? null : (
        <View style={styles.arrows}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('goals.more')}
            hitSlop={8}
            onPress={() => onChange(step(value, 1))}
          >
            <Icon name="arrowUp" size={24} color={theme.colors.foreground} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('goals.less')}
            hitSlop={8}
            onPress={() => onChange(step(value, -1))}
          >
            <Icon name="arrowDown" size={24} color={theme.colors.foreground} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

GoalsPicker.displayName = 'GoalsPicker';

const styles = StyleSheet.create((theme) => ({
  row: (buttonsSide: 'left' | 'right') => ({
    flexDirection: buttonsSide === 'left' ? 'row-reverse' : 'row',
    alignItems: 'center',
    height: 70,
    gap: theme.spacing(2.5),
  }),
  count: {
    minWidth: theme.spacing(10),
    alignItems: 'center',
  },
  arrows: {
    height: '100%',
    justifyContent: 'space-between',
  },
}));
