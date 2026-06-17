import ArrowRight from './arrow-right.svg';

export const ICONS = {
  arrowRight: ArrowRight,
} as const;

export type IconName = keyof typeof ICONS;
