/**
 * 4-point spacing grid. Pass a multiplier to get the pixel value.
 *
 * @example
 * theme.spacing(1)  →  4px
 * theme.spacing(2)  →  8px
 * theme.spacing(4)  →  16px   (base unit, e.g. standard padding)
 * theme.spacing(6)  →  24px
 * theme.spacing(8)  →  32px
 */
export const spacing = (v: number) => v * 4;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
} as const;
