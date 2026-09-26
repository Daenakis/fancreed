import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';
import { typography, type TypographyVariant } from '@/ui/theme';

import { useLanguage, useTheme } from '@/hooks';

const COLOR_KEYS = [
  'primary',
  'secondary',
  'destructive',
  'muted',
  'background',
  'foreground',
  'border',
] as const;

const TYPOGRAPHY_VARIANTS = Object.keys(typography) as TypographyVariant[];

export function PlaygroundScreen() {
  const { t } = useTranslation();
  const { currentTheme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text
        variant="h1Semibold"
        accessibilityRole="header"
        style={styles.title}
      >
        {t('playground.title')}
      </Text>
      <Text color="mutedForeground" style={styles.subtitle}>
        {t('playground.subtitle')}
      </Text>

      <View style={styles.section}>
        <Text
          variant="bodyMSemibold"
          color="mutedForeground"
          style={styles.sectionTitle}
        >
          {t('playground.currentTheme')}
        </Text>
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={toggleTheme}
        >
          <Text variant="bodyLMedium" color="primaryForeground">
            {currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text
          variant="bodyMSemibold"
          color="mutedForeground"
          style={styles.sectionTitle}
        >
          {t('playground.language')}
        </Text>
        <View style={styles.row}>
          {supportedLanguages.map((lng) => {
            const isActive = lng === currentLanguage;

            return (
              <Pressable
                key={lng}
                accessibilityRole="button"
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => changeLanguage(lng)}
              >
                <Text
                  variant="bodyMMedium"
                  color={isActive ? 'primaryForeground' : 'foreground'}
                >
                  {lng.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text
          variant="bodyMSemibold"
          color="mutedForeground"
          style={styles.sectionTitle}
        >
          {t('playground.colors')}
        </Text>
        <View style={styles.colorGrid}>
          {COLOR_KEYS.map((key) => (
            <View key={key} style={styles.colorItem}>
              <View style={styles.colorSwatch(key)} />
              <Text variant="bodySRegular" color="mutedForeground">
                {key}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text
          variant="bodyMSemibold"
          color="mutedForeground"
          style={styles.sectionTitle}
        >
          {t('playground.typography')}
        </Text>
        {TYPOGRAPHY_VARIANTS.map((variant) => (
          <View key={variant} style={styles.typoItem}>
            <Text variant="bodyXSMedium" color="mutedForeground">
              {variant}
            </Text>
            <Text variant={variant}>{t('playground.body')}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

type ColorKey = (typeof COLOR_KEYS)[number];

const styles = StyleSheet.create((theme) => ({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing(6),
    paddingTop: theme.spacing(16),
    paddingBottom: theme.spacing(12),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    marginBottom: theme.spacing(8),
  },
  section: {
    marginBottom: theme.spacing(8),
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing(3),
  },
  button: {
    paddingHorizontal: theme.spacing(5),
    paddingVertical: theme.spacing(3),
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  chip: {
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(2),
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(3),
  },
  colorItem: {
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  colorSwatch: (key: ColorKey) => ({
    width: theme.spacing(12),
    height: theme.spacing(12),
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors[key],
    borderWidth: 1,
    borderColor: theme.colors.border,
  }),
  typoItem: {
    marginBottom: theme.spacing(3),
  },
}));
