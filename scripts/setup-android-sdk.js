#!/usr/bin/env node

/**
 * Creates android/local.properties with the Android SDK path.
 * Uses ANDROID_HOME if set, otherwise falls back to default locations.
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const localPropertiesPath = path.join(projectRoot, 'android', 'local.properties');

const defaultPaths = {
  darwin: path.join(process.env.HOME, 'Library', 'Android', 'sdk'),
  linux: path.join(process.env.HOME, 'Android', 'Sdk'),
  win32: path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk'),
};

const sdkDir =
  process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  defaultPaths[process.platform];

if (!sdkDir) {
  console.error('Error: Could not determine Android SDK location.');
  console.error('Set ANDROID_HOME or ANDROID_SDK_ROOT environment variable.');
  process.exit(1);
}

if (!fs.existsSync(sdkDir)) {
  console.error(`Error: Android SDK not found at: ${sdkDir}`);
  console.error('Install Android Studio or the command-line tools first.');
  process.exit(1);
}

const androidDir = path.dirname(localPropertiesPath);
if (!fs.existsSync(androidDir)) {
  console.error('Error: android/ folder not found. Run "yarn prebuild" first.');
  process.exit(1);
}

const content = `## This file must *NOT* be checked into Version Control Systems,
# as it contains information specific to your local configuration.
#
# Location of the SDK. This is only used by Gradle.
sdk.dir=${sdkDir.replace(/\\/g, '/')}
`;

fs.writeFileSync(localPropertiesPath, content, 'utf8');
console.log(`Created android/local.properties with sdk.dir=${sdkDir}`);
