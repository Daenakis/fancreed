import { CLUB_LOGO_WIDTH } from '@/constants';

/** Club logo shown on auth screens (84×126 source). */
export {
  CLUB_LOGO as AUTH_LOGO,
  CLUB_LOGO_HEIGHT as AUTH_LOGO_HEIGHT,
  CLUB_LOGO_WIDTH as AUTH_LOGO_WIDTH,
} from '@/constants';
/** Collapsed logo is 40 px wide, top-left above the form. */
export const AUTH_LOGO_SCALE = 40 / CLUB_LOGO_WIDTH;
export const AUTH_LOGO_TOP_OFFSET = 12;
export const AUTH_SIDE_PADDING = 18;
