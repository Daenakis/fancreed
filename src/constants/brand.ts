/** Club logo used across the app (header, auth screens). */
export const CLUB_LOGO = require('../../assets/exampleLogo.png');
/**
 * The logo's box where it's shown full-size, centred on the green splash
 * screens (drawn with `contain`). The native splash (app.config.ts,
 * expo-splash-screen) draws the logo at the same size, so the JS splash
 * takes over without a jump — change both together; its `imageWidth` is
 * this width × the logo's height/width (see scripts/make-splash-logo.swift).
 */
export const CLUB_LOGO_WIDTH = 120;
export const CLUB_LOGO_HEIGHT = 180;
/** The small logo top-left on auth screens: 40 px wide, under the status bar. */
export const AUTH_LOGO_SCALE = 40 / CLUB_LOGO_WIDTH;
export const AUTH_LOGO_TOP_OFFSET = 12;
export const AUTH_SIDE_PADDING = 18;
/** Home fan-shop promo (optimised from assets/brand/fan-shop-banner-source.png). */
export const FAN_SHOP_BANNER = require('../../assets/images/home/fan-shop-banner.jpg');
/** Its width / height, so the banner shows the whole picture. */
export const FAN_SHOP_BANNER_RATIO = 1206 / 631;
