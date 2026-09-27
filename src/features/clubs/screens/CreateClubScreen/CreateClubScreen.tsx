import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';

import { Button, PageLayout, Text } from '@/ui/components';

import {
  type PickedImage,
  useCreateClubMutation,
  usePickImage,
  useSetClubPhotoMutation,
} from '@/hooks';

import { goBack, toCreateClubRequest } from '@/utils';

import { getApiErrorMessageKey } from '@/api';

import type { ClubFormValues } from '@/schemas';

import { ClubForm } from '../../components';
import { useClubForm } from '../../hooks';

/**
 * Create a fan club (Figma): the form scrolls, "Create" is pinned below and
 * unlocks once name, address and description are filled. The photo uploads
 * right after the club is created, then the club opens.
 */
export function CreateClubScreen() {
  const { t } = useTranslation();
  const form = useClubForm();
  const pickImage = usePickImage();
  const createClub = useCreateClubMutation();
  const setPhoto = useSetClubPhotoMutation();
  const [photo, setPhotoImage] = useState<PickedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = async (values: ClubFormValues) => {
    setError(null);
    try {
      const { club } = await createClub.mutateAsync(
        toCreateClubRequest(values),
      );
      if (photo) {
        // A failed logo upload shouldn't lose the created club.
        await setPhoto
          .mutateAsync({
            id: club._id,
            mimeType: 'image/jpeg',
            data: photo.base64,
          })
          .catch(() => undefined);
      }
      router.replace({
        pathname: '/gamification/clubs/[id]',
        params: { id: club._id },
      });
    } catch (e) {
      setError(t(getApiErrorMessageKey(e)));
    }
  };

  return (
    <PageLayout
      title={t('club.createClub')}
      onBack={goBack}
      contentStyle={styles.content}
      footer={
        <>
          <Button
            fullWidth
            backgroundColor="brand"
            textColor="onBrand"
            text={t('club.create')}
            disabled={!form.filled}
            loading={createClub.isPending || setPhoto.isPending}
            onPress={form.submitWith(save)}
          />
          {error ? (
            <Text
              variant="bodySRegular"
              color="destructive"
              style={styles.error}
            >
              {error}
            </Text>
          ) : null}
        </>
      }
    >
      <ClubForm
        form={form}
        photo={photo?.uri}
        onPickPhoto={async () => {
          const image = await pickImage();
          if (image) setPhotoImage(image);
        }}
      />
    </PageLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    paddingHorizontal: theme.spacing(4),
  },
  error: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
}));
