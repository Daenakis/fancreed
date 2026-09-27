import { ActivityIndicator, Image, Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { ColorToken, TypographyVariant } from '@/ui/theme';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type { ButtonProps, ButtonSize, ButtonVariant } from './types';

type Colors = {
  /** `null` = transparent. */
  background: ColorToken | null;
  label: ColorToken;
  border?: ColorToken;
};

/** Resolves the colour set for a variant and its current state. */
function getColors(
  variant: ButtonVariant,
  state: { selected: boolean; disabled: boolean },
  custom: { background: ColorToken; label: ColorToken },
): Colors {
  switch (variant) {
    case 'outline':
      return state.selected
        ? {
            background: 'primary',
            label: 'primaryForeground',
            border: 'primary',
          }
        : { background: 'background', label: 'foreground', border: 'border' };
    case 'ghost':
      return { background: null, label: custom.label };
    case 'brandOutline':
      return { background: null, label: 'onBrand', border: 'onBrand' };
    case 'brandLine':
      return { background: null, label: 'foreground', border: 'brand' };
    case 'brand':
      return state.disabled
        ? { background: 'brandStrong', label: 'brandMutedForeground' }
        : { background: 'onBrand', label: 'brand' };
    default:
      return custom;
  }
}

function getLabelVariant(
  variant: ButtonVariant,
  size: ButtonSize,
  iconOnTop: boolean,
): TypographyVariant {
  if (iconOnTop) return 'bodySRegular';
  if (size === 'xs') return 'bodyMRegular';
  if (size === 'sm') return 'h4Semibold';
  if (variant === 'brand') return 'bodyMMedium';
  if (variant === 'outline') return 'bodyLMedium';
  return 'bodyLRegular';
}

/**
 * The app's button. One component for actions, choices and brand screens —
 * pick the look with `variant`, the density with `size`.
 *
 * @example
 * <Button text={t('common.save')} onPress={save} loading={isPending} />
 * <Button variant="outline" text={label} image={icon} selected={isActive} onPress={select} />
 * <Button variant="outline" text={t('club.uploadDocument')} icon="upload" iconPosition="right" onPress={pick} />
 * <Button variant="ghost" icon="bell" iconPosition="top" text={t('match.remind')} onPress={remind} />
 * <Button variant="brand" fullWidth text={t('auth.signIn')} disabled={!isValid} onPress={submit} />
 */
export function Button({
  text,
  variant = 'solid',
  size = 'md',
  image,
  icon,
  iconPosition = 'left',
  selected = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  backgroundColor = 'foreground',
  textColor,
  style,
  ...props
}: ButtonProps) {
  const { theme } = useUnistyles();
  const ghost = variant === 'ghost';
  const iconOnTop = iconPosition === 'top';
  const colors = getColors(
    variant,
    { selected, disabled },
    {
      background: backgroundColor,
      // Ghost buttons sit on the screen background: label in text colour.
      label: textColor ?? (ghost ? 'foreground' : 'background'),
    },
  );
  const iconElement = icon ? (
    <Icon
      name={icon}
      color={theme.colors[colors.label]}
      style={
        iconOnTop
          ? styles.iconTop
          : iconPosition === 'left'
            ? styles.iconLeft
            : styles.iconRight
      }
    />
  ) : null;
  // Brand buttons show "disabled" with colours; the others dim.
  const dimmed = disabled && variant !== 'brand';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
        selected: variant === 'outline' ? selected : undefined,
      }}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button(size, colors.background, colors.border),
        ghost && styles.ghost,
        iconOnTop && styles.column,
        fullWidth && styles.fullWidth,
        dimmed && styles.dimmed,
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors[colors.label]} />
      ) : (
        <>
          {image ? <Image source={image} style={styles.image} /> : null}
          {icon && iconPosition !== 'right' ? iconElement : null}
          <Text
            variant={getLabelVariant(variant, size, iconOnTop)}
            color={colors.label}
            style={iconOnTop ? styles.centered : undefined}
          >
            {text}
          </Text>
          {icon && iconPosition === 'right' ? iconElement : null}
        </>
      )}
    </Pressable>
  );
}

Button.displayName = 'Button';

const styles = StyleSheet.create((theme) => ({
  button: (
    size: ButtonSize,
    background: ColorToken | null,
    border?: ColorToken,
  ) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    minHeight: size === 'md' ? theme.spacing(12) : undefined,
    paddingVertical: {
      md: theme.spacing(2.5),
      sm: theme.spacing(1),
      xs: theme.spacing(2),
    }[size],
    paddingHorizontal: {
      md: theme.spacing(6),
      sm: theme.spacing(4),
      xs: theme.spacing(2),
    }[size],
    borderRadius: theme.radius.md,
    borderWidth: border ? 1 : 0,
    borderColor: border ? theme.colors[border] : undefined,
    backgroundColor: background ? theme.colors[background] : 'transparent',
  }),
  // No box: just the content, compact touch area.
  ghost: {
    minHeight: undefined,
    paddingVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(1),
  },
  column: {
    flexDirection: 'column',
  },
  iconTop: {
    marginBottom: theme.spacing(1),
  },
  centered: {
    textAlign: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  dimmed: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.7,
  },
  iconLeft: {
    marginRight: theme.spacing(2),
  },
  iconRight: {
    marginLeft: theme.spacing(2),
  },
  image: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(2.5),
  },
}));
