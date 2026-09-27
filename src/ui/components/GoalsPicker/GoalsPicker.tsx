import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type { ArrowButtonProps, GoalsPickerProps } from './types';

const MAX_GOALS = 9;

/** Next value for an arrow press: starts at 0, wraps 9 → 0 and 0 → 9. */
function step(value: number | null, delta: 1 | -1): number {
  if (value === null) return 0;
  return (value + delta + MAX_GOALS + 1) % (MAX_GOALS + 1);
}

/**
 * One team's goals in a score prediction: a big digit between up/down
 * arrow buttons. Shows "?" until the first press. Two of them make "? : ?".
 *
 * @example
 * <GoalsPicker value={home} onChange={setHome} color="onBrand" accessibilityLabel={homeTeam} />
 */
export function GoalsPicker({
  value,
  onChange,
  color = 'foreground',
  readOnly = false,
  accessibilityLabel,
  style,
}: GoalsPickerProps) {
  const { t } = useTranslation();
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
      style={[styles.column, style]}
    >
      {readOnly ? null : (
        <ArrowButton
          icon="arrowUp"
          label={t('goals.more')}
          onPress={() => onChange(step(value, 1))}
        />
      )}
      <View style={styles.count}>
        {/* Re-mounting on each value plays the entering animation. */}
        <Animated.View key={String(value)} entering={FadeInDown.duration(200)}>
          <Text variant="h1Semibold" color={color}>
            {value === null ? '?' : value}
          </Text>
        </Animated.View>
      </View>
      {readOnly ? null : (
        <ArrowButton
          icon="arrowDown"
          label={t('goals.less')}
          onPress={() => onChange(step(value, -1))}
        />
      )}
    </View>
  );
}

GoalsPicker.displayName = 'GoalsPicker';

function ArrowButton({ icon, label, onPress }: ArrowButtonProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
    >
      <Icon name={icon} size={20} color={theme.colors.brand} />
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  column: {
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  count: {
    minWidth: theme.spacing(10),
    alignItems: 'center',
  },
  arrow: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background,
  },
  pressed: {
    opacity: 0.7,
  },
}));
