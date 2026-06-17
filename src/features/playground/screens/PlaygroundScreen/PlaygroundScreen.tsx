import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

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

export function PlaygroundScreen() {
  const { t } = useTranslation();
  const { currentTheme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        {t('playground.title')}
      </Text>
      <Text style={styles.subtitle}>{t('playground.subtitle')}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('playground.currentTheme')}</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={toggleTheme}
        >
          <Text style={styles.buttonText}>
            {currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('playground.language')}</Text>
        <View style={styles.row}>
          {supportedLanguages.map((lng) => (
            <Pressable
              key={lng}
              accessibilityRole="button"
              style={[
                styles.chip,
                lng === currentLanguage && styles.chipActive,
              ]}
              onPress={() => changeLanguage(lng)}
            >
              <Text
                style={[
                  styles.chipText,
                  lng === currentLanguage && styles.chipTextActive,
                ]}
              >
                {lng.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('playground.colors')}</Text>
        <View style={styles.colorGrid}>
          {COLOR_KEYS.map((key) => (
            <View key={key} style={styles.colorItem}>
              <View style={styles.colorSwatch(key)} />
              <Text style={styles.colorLabel}>{key}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('playground.typography')}</Text>
        <Text style={styles.typoHeading}>{t('playground.heading')}</Text>
        <Text style={styles.typoBody}>{t('playground.body')}</Text>
        <Text style={styles.typoCaption}>{t('playground.caption')}</Text>
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
    fontSize: theme.font.sizes['2xl'],
    fontWeight: theme.font.weights.bold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing(8),
  },
  section: {
    marginBottom: theme.spacing(8),
  },
  sectionTitle: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.semibold,
    color: theme.colors.mutedForeground,
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
  buttonText: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.semibold,
    color: theme.colors.primaryForeground,
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
  chipText: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.medium,
    color: theme.colors.foreground,
  },
  chipTextActive: {
    color: theme.colors.primaryForeground,
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
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors[key],
    borderWidth: 1,
    borderColor: theme.colors.border,
  }),
  colorLabel: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.mutedForeground,
  },
  typoHeading: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing(2),
  },
  typoBody: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.regular,
    color: theme.colors.foreground,
    marginBottom: theme.spacing(2),
  },
  typoCaption: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.mutedForeground,
  },
}));
