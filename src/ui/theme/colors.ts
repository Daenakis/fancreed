export const palette = {
  // Neutral
  black: '#101010',
  grey400: '#474747',
  grey300: '#929292',
  grey200: '#D0D0D0',
  grey150: '#E6E6E6',
  grey100: '#FAFAFA',
  white: '#FFFFFF',
  // Accent green
  green300: '#00783A',
  green200: '#008C43',
  green100: '#00A650',
  // Mint green
  mintGreen300: '#66CA96',
  mintGreen200: '#CCEDDC',
  mintGreen100: '#F5FBF8',
  // Red
  red300: '#CF0000',
  red200: '#FFA8A8',
  red100: '#FFF1F1',
} as const;

export const lightColors = {
  background: palette.white,
  foreground: palette.black,
  primary: palette.green100,
  primaryForeground: palette.white,
  primaryHover: palette.green200,
  secondary: palette.grey100,
  secondaryForeground: palette.black,
  muted: palette.grey150,
  mutedForeground: palette.grey300,
  destructive: palette.red300,
  destructiveForeground: palette.white,
  destructiveMuted: palette.red100,
  border: palette.grey200,
  ring: palette.green100,
} as const;

export const darkColors = {
  background: palette.black,
  foreground: palette.white,
  primary: palette.green100,
  primaryForeground: palette.white,
  primaryHover: palette.green200,
  secondary: palette.grey400,
  secondaryForeground: palette.white,
  muted: palette.grey400,
  mutedForeground: palette.grey300,
  destructive: palette.red300,
  destructiveForeground: palette.white,
  destructiveMuted: palette.red100,
  border: palette.grey400,
  ring: palette.green100,
} as const;

export type ColorToken = keyof typeof lightColors;
