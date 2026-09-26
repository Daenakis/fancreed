/// <reference types="node" />
/**
 * Adopts the UIScene life cycle on iOS. The iOS 27 SDK traps at launch
 * (`_UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption`) unless the
 * app uses scenes. Expo SDK 57 ships `ExpoAppSceneDelegate`, but its prebuild
 * template doesn't wire it up — the SDK 58 template does.
 *
 * Mirrors the SDK 58 template: adds `SceneDelegate.swift`, the scene manifest
 * in Info.plist, and moves window creation from `AppDelegate` to the scene.
 * Deep-link overrides stay in `AppDelegate`; the scene forwarder dedupes them.
 *
 * TODO: remove when upgrading to Expo SDK 58.
 */
import {
  type ConfigPlugin,
  IOSConfig,
  withAppDelegate,
  withDangerousMod,
  withInfoPlist,
  withXcodeProject,
} from 'expo/config-plugins';
import fs from 'fs';
import path from 'path';

const SCENE_DELEGATE_FILE = 'SceneDelegate.swift';

const SCENE_DELEGATE_SOURCE = `internal import Expo

@objc(SceneDelegate)
class SceneDelegate: ExpoAppSceneDelegate {
  // Extension point for config plugins.
}
`;

const START_REACT_NATIVE_BLOCK =
  /#if os\(iOS\) \|\| os\(tvOS\)\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\s*factory\.startReactNative\([\s\S]*?\)\s*#endif\n/;

const APP_DELEGATE_CLASS = 'class AppDelegate: ExpoAppDelegate {';

const withSceneManifest: ConfigPlugin = (config) =>
  withInfoPlist(config, (cfg) => {
    cfg.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate',
          },
        ],
      },
    };
    return cfg;
  });

const withSceneAppDelegate: ConfigPlugin = (config) =>
  withAppDelegate(config, (cfg) => {
    let contents = cfg.modResults.contents;
    if (contents.includes('ExpoReactNativeFactoryProvider')) {
      return cfg;
    }
    if (
      !contents.includes(APP_DELEGATE_CLASS) ||
      !START_REACT_NATIVE_BLOCK.test(contents)
    ) {
      throw new Error(
        '[withIosSceneDelegate] AppDelegate.swift does not match the Expo SDK 57 template. ' +
          'If you upgraded to SDK 58+, remove this plugin.',
      );
    }
    contents = contents
      .replace(
        APP_DELEGATE_CLASS,
        'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {',
      )
      .replace(
        START_REACT_NATIVE_BLOCK,
        '    // The window is created and React Native is started by `SceneDelegate`\n' +
          '    // under the scene-based life cycle (required by the iOS 27 SDK).\n',
      );
    cfg.modResults.contents = contents;
    return cfg;
  });

const withSceneDelegateFile: ConfigPlugin = (config) => {
  config = withDangerousMod(config, [
    'ios',
    (cfg) => {
      const projectName = IOSConfig.XcodeUtils.getProjectName(
        cfg.modRequest.projectRoot,
      );
      const filePath = path.join(
        cfg.modRequest.platformProjectRoot,
        projectName,
        SCENE_DELEGATE_FILE,
      );
      fs.writeFileSync(filePath, SCENE_DELEGATE_SOURCE);
      return cfg;
    },
  ]);

  return withXcodeProject(config, (cfg) => {
    const projectName = IOSConfig.XcodeUtils.getProjectName(
      cfg.modRequest.projectRoot,
    );
    const filepath = `${projectName}/${SCENE_DELEGATE_FILE}`;
    if (!cfg.modResults.hasFile(filepath)) {
      IOSConfig.XcodeUtils.addBuildSourceFileToGroup({
        filepath,
        groupName: projectName,
        project: cfg.modResults,
      });
    }
    return cfg;
  });
};

const withIosSceneDelegate: ConfigPlugin = (config) =>
  withSceneDelegateFile(withSceneAppDelegate(withSceneManifest(config)));

export default withIosSceneDelegate;
