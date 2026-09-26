/**
 * Typography scale from Figma — the single source of truth for text styles.
 * Use via <Text variant="..."> (preferred) or `theme.typography.*` in styles.
 *
 * Weight comes from the font family (Inter-Medium, Inter-SemiBold…), never
 * from `fontWeight` — combining a custom family with `fontWeight` renders
 * a faux/incorrect weight on Android.
 */
export const typography = {
  // Display — not in Figma yet; big numbers (prediction score)
  displaySemibold: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 62,
    lineHeight: 70,
  },
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

export type TypographyVariant = keyof typeof typography;
