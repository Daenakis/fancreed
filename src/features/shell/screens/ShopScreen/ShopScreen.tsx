import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Linking, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import { WebView } from 'react-native-webview';

import { Button, EmptyState, LoadingMore } from '@/ui/components';

import { CONFIG } from '@/config';

/** Links the web view can't open itself — handed to the phone's apps. */
const APP_LINK = /^(tel|mailto|sms):/i;

/**
 * Shop tab: the club's online fan shop in a full-height web view — no app
 * header (the shop has its own), no swipe-back gesture inside it. The
 * Android back button steps back through the shop's pages; phone / email
 * links open in the phone's apps. The tab keeps its page when switching tabs.
 */
export function ShopScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const web = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [failed, setFailed] = useState(false);

  // Android back goes back in the shop before leaving the tab.
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (!canGoBack) return false;
          web.current?.goBack();
          return true;
        },
      );
      return () => subscription.remove();
    }, [canGoBack]),
  );

  return (
    <View style={styles.root(insets.top)}>
      {failed ? (
        <View style={styles.error}>
          <EmptyState
            icon="shop"
            title={t('shop.errorTitle')}
            text={t('shop.errorText')}
          />
          <Button
            size="xs"
            backgroundColor="brand"
            textColor="onBrand"
            text={t('shop.retry')}
            // Re-mounts the web view, which loads the shop again.
            onPress={() => setFailed(false)}
          />
        </View>
      ) : (
        <WebView
          ref={web}
          source={{ uri: CONFIG.LINKS.SHOP }}
          style={styles.web}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loading}>
              <LoadingMore loading />
            </View>
          )}
          // No swipe-back inside the shop (iOS); off by default, kept explicit.
          allowsBackForwardNavigationGestures={false}
          pullToRefreshEnabled
          // "Open in new window" links stay in the same view.
          setSupportMultipleWindows={false}
          onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
          onShouldStartLoadWithRequest={({ url }) => {
            if (!APP_LINK.test(url)) return true;
            void Linking.openURL(url).catch(() => {});
            return false;
          }}
          onError={() => setFailed(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  // Starts under the status bar (there's no app header above it).
  root: (topInset: number) => ({
    flex: 1,
    paddingTop: topInset,
    backgroundColor: theme.colors.background,
  }),
  web: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(4),
    paddingHorizontal: theme.spacing(4),
  },
}));
