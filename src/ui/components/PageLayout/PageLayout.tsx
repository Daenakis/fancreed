import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type {
  DismissKeyboardProps,
  HeaderButtonProps,
  PageLayoutProps,
  PageLayoutTone,
} from './types';

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
  tone = 'brand',
  scrollable = true,
  children,
  footer,
  contentStyle,
}: PageLayoutProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const plain = tone === 'plain';
  const onHeader = plain ? theme.colors.foreground : theme.colors.onBrand;

  return (
    <View style={styles.root(tone)}>
      <View style={styles.header(insets.top)}>
        <HeaderButton
          icon="arrowLeft"
          label={t('common.back')}
          onPress={onBack}
          color={onHeader}
        />
        <Text
          variant={plain ? 'bodyLMedium' : 'bodyMMedium'}
          color={plain ? 'foreground' : 'onBrand'}
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
          color={onHeader}
        />
      </View>
      <View style={styles.sheet}>
        {scrollable ? (
          <ScrollView
            contentContainerStyle={styles.fill}
            showsVerticalScrollIndicator={false}
            // Taps on buttons work while typing; scrolling hides the keyboard.
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <DismissKeyboard
              style={[styles.content, styles.fill, contentStyle]}
            >
              {children}
            </DismissKeyboard>
          </ScrollView>
        ) : (
          <DismissKeyboard style={[styles.content, styles.fill, contentStyle]}>
            {children}
          </DismissKeyboard>
        )}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </View>
  );
}

PageLayout.displayName = 'PageLayout';

/**
 * Content area: a tap on empty space hides the keyboard. It also fills the
 * screen, so an EmptyState (flex: 1) centres in the free space.
 */
function DismissKeyboard({ style, children }: DismissKeyboardProps) {
  return (
    <Pressable accessible={false} onPress={Keyboard.dismiss} style={style}>
      {children}
    </Pressable>
  );
}

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
  root: (tone: PageLayoutTone) => ({
    flex: 1,
    backgroundColor:
      tone === 'plain' ? theme.colors.background : theme.colors.brand,
  }),
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
  footer: {
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(3),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  fill: {
    flexGrow: 1,
  },
}));
