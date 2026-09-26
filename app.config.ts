import 'tsx/cjs';

import type { AppIconBadgeConfig } from 'app-icon-badge/types';
import type { ConfigContext, ExpoConfig } from 'expo/config';

import Env from './env';
import withIosSceneDelegate from './plugins/withIosSceneDelegate';

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: Env.EXPO_PUBLIC_RUN_MODE !== 'prod',
  badges: [
    {
      text: Env.EXPO_PUBLIC_RUN_MODE,
      type: 'banner',
      color: 'white',
    },
    {
      text: Env.EXPO_PUBLIC_VERSION.toString(),
      type: 'ribbon',
      color: 'white',
    },
  ],
};

// Expo account or organization that owns the project (`eas whoami`).
const EXPO_ACCOUNT_OWNER = 'fancreed';
// UUID printed by `eas init` (e.g. 'a1b2c3d4-...'). Leave empty until then —
// a non-UUID value makes EAS fail with "Invalid UUID appId".
const EAS_PROJECT_ID = '';

const createConfig = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.EXPO_PUBLIC_NAME,
  description: `${Env.EXPO_PUBLIC_NAME} Mobile App`,
  owner: EXPO_ACCOUNT_OWNER,

  scheme: Env.EXPO_PUBLIC_SCHEME,
  slug: 'fancreed',

  version: Env.EXPO_PUBLIC_VERSION.toString(),

  orientation: 'portrait',
  icon: './assets/icon.png',

  ios: {
    supportsTablet: false,
    bundleIdentifier: Env.EXPO_PUBLIC_BUNDLE_ID,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/adaptive-icon.png',
    },
    package: Env.EXPO_PUBLIC_PACKAGE,
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-status-bar',
    [
      'expo-localization',
      {
        supportedLocales: ['en', 'uk'],
      },
    ],
    [
      'expo-dev-client',
      {
        launchMode: 'most-recent',
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#2E3C4B',
        image: './assets/splash-icon.png',
        imageWidth: 150,
      },
    ],
    ['app-icon-badge', appIconBadgeConfig],
    ...(Env.EXPO_PUBLIC_BUGSNAG_API_KEY
      ? ['@bugsnag/plugin-expo-eas-sourcemaps']
      : []),
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/Inter-Regular.ttf',
          './assets/fonts/Inter-Medium.ttf',
          './assets/fonts/Inter-SemiBold.ttf',
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    // supportsRTL: true,
    eas: EAS_PROJECT_ID ? { projectId: EAS_PROJECT_ID } : {},
    bugsnag: {
      apiKey: Env.EXPO_PUBLIC_BUGSNAG_API_KEY || undefined,
    },
  },
});

// iOS 27 SDK requires the scene life cycle; remove on Expo SDK 58.
export default (ctx: ConfigContext): ExpoConfig =>
  withIosSceneDelegate(createConfig(ctx));
