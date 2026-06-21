export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const typography = {
  // Heading
  h1Semibold: { fontFamily: 'Inter-SemiBold', fontSize: 32, lineHeight: 36 },
  h2Medium: { fontFamily: 'Inter-Medium', fontSize: 24, lineHeight: 32 },
  h3Medium: { fontFamily: 'Inter-Medium', fontSize: 20, lineHeight: 28 },
  h4Semibold: { fontFamily: 'Inter-SemiBold', fontSize: 18, lineHeight: 26 },
  h4Medium: { fontFamily: 'Inter-Medium', fontSize: 18, lineHeight: 26 },
  h4Regular: { fontFamily: 'Inter-Regular', fontSize: 18, lineHeight: 26 },
  // Body
  bodyLMedium: { fontFamily: 'Inter-Medium', fontSize: 16, lineHeight: 24 },
  bodyLRegular: { fontFamily: 'Inter-Regular', fontSize: 16, lineHeight: 24 },
  bodyMSemibold: { fontFamily: 'Inter-SemiBold', fontSize: 14, lineHeight: 20 },
  bodyMMedium: { fontFamily: 'Inter-Medium', fontSize: 14, lineHeight: 20 },
  bodyMRegular: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20 },
  bodySSemibold: { fontFamily: 'Inter-SemiBold', fontSize: 12, lineHeight: 16 },
  bodySRegular: { fontFamily: 'Inter-Regular', fontSize: 12, lineHeight: 16 },
  bodyXSMedium: { fontFamily: 'Inter-Medium', fontSize: 10, lineHeight: 14 },
} as const;
