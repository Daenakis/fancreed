import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type { HeaderButtonProps, PageLayoutProps } from './types';

/**
 * Detail screen frame: green header (back, centred title, share) with the
 * content on a white sheet with rounded top corners.
 *
 * @example
 * <PageLayout title={t('lineup.title')} onBack={router.back} onShare={share}>
 *   <Pitch lineup={lineup} />
 * </PageLayout>
 */
export function PageLayout({
  title,
  onBack,
  onShare,
  scrollable = true,
  children,
  contentStyle,
}: PageLayoutProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={styles.header(insets.top)}>
        <HeaderButton
          icon="arrowLeft"
          label={t('common.back')}
          onPress={onBack}
          color={theme.colors.onBrand}
        />
        <Text
          variant="bodyMMedium"
          color="onBrand"
          numberOfLines={1}
          accessibilityRole="header"
          style={styles.title}
        >
          {title}
        </Text>
        <HeaderButton
          icon="telegram"
          label={t('common.share')}
          onPress={onShare}
          color={theme.colors.onBrand}
        />
      </View>
      <View style={styles.sheet}>
        {scrollable ? (
          <ScrollView
            contentContainerStyle={[styles.content, contentStyle]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, styles.fill, contentStyle]}>
            {children}
          </View>
        )}
      </View>
    </View>
  );
}

PageLayout.displayName = 'PageLayout';

function HeaderButton({ icon, label, onPress, color }: HeaderButtonProps) {
  // Keeps the title centred when a button is missing.
  if (!onPress) return <View style={styles.button} />;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={16}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon name={icon} size={20} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.brand,
  },
  header: (topInset: number) => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: topInset + theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingHorizontal: theme.spacing(4),
  }),
  title: {
    flex: 1,
    textAlign: 'center',
  },
  button: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  sheet: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingVertical: theme.spacing(4),
  },
  fill: {
    flex: 1,
  },
}));
