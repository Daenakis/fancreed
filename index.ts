// Order matters — these are side-effect imports evaluated top to bottom:
// 1. Unistyles must be configured before any route/StyleSheet is loaded.
// 2. BugSnag must start before routes load so startup errors are captured.
// 3. expo-router/entry registers the app and must come last.
import './src/ui/theme/unistyles';
import './src/config/bugsnag';
import 'expo-router/entry';
