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
  // Brand green (auth / splash backgrounds)
  brandGreen300: '#3F8652',
  brandGreen200: '#58AF6C',
  // White overlays for content on brand backgrounds
  whiteAlpha70: 'rgba(255, 255, 255, 0.7)',
  whiteAlpha50: 'rgba(255, 255, 255, 0.5)',
  whiteAlpha30: 'rgba(255, 255, 255, 0.3)',
  whiteAlpha13: 'rgba(255, 255, 255, 0.13)',
  // Shadows
  blackAlpha25: 'rgba(0, 0, 0, 0.25)',
  // Fan card metallic gradient + ink
  metal100: '#EBD8C3',
  metal200: '#E4D5C7',
  metal300: '#C9AE95',
  metal400: '#B0927D',
  metalInk: '#3A2613',
  // Highlight (own team row, women badge)
  yellow: '#F7D54A',
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
  primaryPressed: palette.green200,
  secondary: palette.grey100,
  secondaryForeground: palette.black,
  muted: palette.grey150,
  mutedForeground: palette.grey300,
  destructive: palette.red300,
  destructiveForeground: palette.white,
  destructiveMuted: palette.red100,
  border: palette.grey200,
  ring: palette.green100,
  // Brand screens (sign-in, splash) look the same in both themes
  brand: palette.brandGreen200,
  brandStrong: palette.brandGreen300,
  brandSurface: palette.whiteAlpha13,
  brandBorder: palette.whiteAlpha30,
  brandMutedForeground: palette.whiteAlpha70,
  onBrand: palette.white,
  socialSurface: palette.white,
  socialForeground: palette.black,
  shadow: palette.blackAlpha25,
  translucentSurface: palette.whiteAlpha50,
  // Dark card surfaces that stay dark in both themes (fan card)
  inverseSurface: palette.black,
  onInverseSurface: palette.white,
  highlight: palette.yellow,
  // Fan card (same in both themes)
  fanCardEdge: palette.metal400,
  fanCardLight: palette.metal200,
  fanCardWarm: palette.metal100,
  fanCardShade: palette.metal300,
  fanCardInk: palette.metalInk,
  onFanCard: palette.black,
  onHighlight: palette.black,
} as const;

export const darkColors = {
  background: palette.black,
  foreground: palette.white,
  primary: palette.green100,
  primaryForeground: palette.white,
  primaryPressed: palette.green200,
  secondary: palette.grey400,
  secondaryForeground: palette.white,
  muted: palette.grey400,
  mutedForeground: palette.grey300,
  destructive: palette.red300,
  destructiveForeground: palette.white,
  destructiveMuted: palette.red100,
  border: palette.grey400,
  ring: palette.green100,
  // Brand screens (sign-in, splash) look the same in both themes
  brand: palette.brandGreen200,
  brandStrong: palette.brandGreen300,
  brandSurface: palette.whiteAlpha13,
  brandBorder: palette.whiteAlpha30,
  brandMutedForeground: palette.whiteAlpha70,
  onBrand: palette.white,
  socialSurface: palette.white,
  socialForeground: palette.black,
  shadow: palette.blackAlpha25,
  translucentSurface: palette.whiteAlpha50,
  // Dark card surfaces that stay dark in both themes (fan card)
  inverseSurface: palette.black,
  onInverseSurface: palette.white,
  highlight: palette.yellow,
  // Fan card (same in both themes)
  fanCardEdge: palette.metal400,
  fanCardLight: palette.metal200,
  fanCardWarm: palette.metal100,
  fanCardShade: palette.metal300,
  fanCardInk: palette.metalInk,
  onFanCard: palette.black,
  onHighlight: palette.black,
} as const;

export type ColorToken = keyof typeof lightColors;
