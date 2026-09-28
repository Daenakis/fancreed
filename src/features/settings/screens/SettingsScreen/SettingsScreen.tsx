import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking } from 'react-native';
import { useMMKVBoolean } from 'react-native-mmkv';
import { StyleSheet } from 'react-native-unistyles';

import { BottomSheet, ChoiceGroup, MenuRow, PageLayout } from '@/ui/components';

import { useLanguage } from '@/hooks';

import { goBack, storage } from '@/utils';

import { STORAGE_KEYS } from '@/constants';

import type { Language } from '@/i18n/resources';

/** Each language in its own name, so it's findable whatever is selected. */
const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  uk: 'Українська',
};

/**
 * Settings (Figma "Налаштування"): verification, push notifications and
 * geolocation switches, and the app language picked in a bottom sheet.
 */
export function SettingsScreen() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [languageOpen, setLanguageOpen] = useState(false);
  // TODO(push): no push service yet — the switch only stores the choice.
  const [push = false, setPush] = useMMKVBoolean(
    STORAGE_KEYS.PUSH_ENABLED,
    storage,
  );
  const [location = false, setLocation] = useMMKVBoolean(
    STORAGE_KEYS.LOCATION_ENABLED,
    storage,
  );

  // Location stays on only while the OS permission does (it can be revoked
  // in the phone settings).
  useEffect(() => {
    if (!location) return;
    void Location.getForegroundPermissionsAsync().then(({ granted }) => {
      if (!granted) setLocation(false);
    });
  }, [location, setLocation]);

  const toggleLocation = async () => {
    if (location) return setLocation(false);
    const { granted, canAskAgain } =
      await Location.requestForegroundPermissionsAsync();
    if (granted) return setLocation(true);
    // Denied for good: only the phone settings can turn it on.
    Alert.alert(
      t('settings.locationDenied'),
      undefined,
      canAskAgain
        ? undefined
        : [
            { text: t('settings.notNow'), style: 'cancel' },
            {
              text: t('settings.openSettings'),
              onPress: () => void Linking.openSettings(),
            },
          ],
    );
  };

  return (
    <PageLayout
      title={t('settings.title')}
      onBack={goBack}
      contentStyle={styles.content}
    >
      <MenuRow
        icon="verification"
        label={t('settings.verification')}
        chevron
        // No design for the verification flow yet.
        onPress={() => Alert.alert(t('menu.comingSoon'))}
      />
      <MenuRow
        icon="notification"
        label={t('settings.push')}
        toggled={push}
        onPress={() => setPush(!push)}
      />
      <MenuRow
        icon="location"
        label={t('settings.location')}
        toggled={location}
        onPress={() => void toggleLocation()}
      />
      <MenuRow
        icon="language"
        label={t('settings.language')}
        value={LANGUAGE_NAMES[currentLanguage]}
        onPress={() => setLanguageOpen(true)}
      />
      <BottomSheet
        visible={languageOpen}
        onClose={() => setLanguageOpen(false)}
        title={t('settings.language')}
      >
        <ChoiceGroup
          variant="list"
          options={supportedLanguages.map((language) => ({
            label: LANGUAGE_NAMES[language],
            value: language,
          }))}
          value={currentLanguage}
          onChange={(language) => {
            changeLanguage(language);
            setLanguageOpen(false);
          }}
        />
      </BottomSheet>
    </PageLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(4),
  },
}));
