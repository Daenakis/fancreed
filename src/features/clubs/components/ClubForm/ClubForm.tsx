import type { ParseKeys } from 'i18next';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Button, ChoiceGroup, Icon, Text, TextInput } from '@/ui/components';

import type { ClubFormProps, PhotoPickerProps } from './types';

const SOCIALS = [
  {
    name: 'instagram',
    label: 'club.instagram',
    hint: 'https://www.instagram.com/',
  },
  { name: 'telegram', label: 'club.telegram', hint: 'https://t.me/' },
  {
    name: 'facebook',
    label: 'club.facebook',
    hint: 'https://www.facebook.com/',
  },
] as const;

/**
 * Create-club fields (Figma): photo, name, who can join, address,
 * description and optional social links behind "+ Add socials". The screen
 * holds the form state (`useClubForm`) and the submit button.
 */
export function ClubForm({ form, photo, onPickPhoto, style }: ClubFormProps) {
  const { t } = useTranslation();
  const [showSocials, setShowSocials] = useState(false);
  const {
    control,
    changeHandler,
    formState: { submitCount },
  } = form;
  const errorText = (message?: string) =>
    message ? t(message as ParseKeys) : undefined;

  const text = (
    name: 'name' | 'address' | 'description',
    label: string,
    placeholder: string,
    multiline = false,
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState }) => (
        <TextInput
          label={label}
          placeholder={placeholder}
          value={value}
          onChangeText={changeHandler(name, onChange)}
          onBlur={onBlur}
          multiline={multiline}
          error={errorText(fieldState.error?.message)}
          shakeKey={submitCount}
        />
      )}
    />
  );

  return (
    <View style={[styles.container, style]}>
      <PhotoPicker photo={photo} onPress={onPickPhoto} />
      {text('name', `${t('club.name')}*`, t('club.namePlaceholder'))}
      <Controller
        control={control}
        name="visibility"
        render={({ field: { value, onChange } }) => (
          <View style={styles.field}>
            <Text variant="bodyMRegular">{t('club.visibility')}</Text>
            <ChoiceGroup
              value={value}
              onChange={onChange}
              options={[
                { label: t('club.open'), value: 'open' },
                { label: t('club.friends'), value: 'friends' },
              ]}
            />
          </View>
        )}
      />
      {text('address', `${t('club.address')}*`, t('club.address'))}
      {text(
        'description',
        `${t('club.description')}*`,
        t('club.descriptionPlaceholder'),
        true,
      )}
      {showSocials ? (
        SOCIALS.map((social) => (
          <Controller
            key={social.name}
            control={control}
            name={social.name}
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <TextInput
                label={t(social.label)}
                placeholder={social.hint}
                value={value}
                onChangeText={changeHandler(social.name, onChange)}
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="url"
                error={errorText(fieldState.error?.message)}
                shakeKey={submitCount}
              />
            )}
          />
        ))
      ) : (
        <Button
          variant="ghost"
          icon="plus"
          text={t('club.addSocials')}
          textColor="brand"
          onPress={() => setShowSocials(true)}
          style={styles.addSocials}
        />
      )}
    </View>
  );
}

ClubForm.displayName = 'ClubForm';

/** "Upload photo" button, then the picked photo with a "Change photo" chip. */
function PhotoPicker({ photo, onPress }: PhotoPickerProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  if (!photo) {
    return (
      <Button
        variant="brandLine"
        size="xs"
        fullWidth
        icon="upload"
        text={t('club.uploadPhoto')}
        onPress={onPress}
      />
    );
  }

  return (
    <View style={styles.photoCard}>
      <Image source={{ uri: photo }} resizeMode="cover" style={styles.photo} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('club.changePhoto')}
        onPress={onPress}
        style={({ pressed }) => [styles.changeChip, pressed && styles.pressed]}
      >
        <Icon name="changeImage" size={16} color={theme.colors.brand} />
        <Text variant="bodySRegular" color="brand">
          {t('club.changePhoto')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing(4),
  },
  field: {
    gap: theme.spacing(2),
  },
  addSocials: {
    alignSelf: 'flex-start',
  },
  photoCard: {
    height: 250,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.muted,
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  changeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(4),
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(2),
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
  },
  pressed: {
    opacity: 0.7,
  },
}));
