import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  BottomSheet,
  Button,
  ChoiceGroup,
  EmptyState,
  LoadingMore,
  MenuRow,
  Notice,
  PageLayout,
} from '@/ui/components';

import {
  useEditProfileMutation,
  useFanLevelQuery,
  useLogoutMutation,
  usePickImage,
  useProfileQuery,
  useSetPhotoMutation,
} from '@/hooks';

import { goBack } from '@/utils';

import { getApiErrorMessageKey } from '@/api';

import type { Player } from '@/types/api';

import { SquadBlock } from '@/features/home';

import { ProfileCard } from '../../components';
import { CLOTHING_SIZES, useClothingSize } from '../../hooks';

/** api-football id the backend stores as the favourite player. */
const playerId = (player: Player) => player.id ?? Number(player._id);

/**
 * "My profile": the fan with their loyalty level, favourite player, clothing
 * size and sign-out. Asks to fill the profile until the required fields are set.
 */
export function ProfileScreen() {
  const { t } = useTranslation();
  const { data: profile, isPending, error } = useProfileQuery();
  const { data: level } = useFanLevelQuery();
  const editProfile = useEditProfileMutation();
  const setPhoto = useSetPhotoMutation();
  const pickImage = usePickImage();
  const logout = useLogoutMutation();
  const [size, setSize] = useClothingSize();
  const [sizeOpen, setSizeOpen] = useState(false);

  const changePhoto = async () => {
    const image = await pickImage();
    if (!image) return;
    setPhoto.mutate(
      { mimeType: 'image/jpeg', data: image.base64 },
      { onError: () => Alert.alert(t('profile.photoFailed')) },
    );
  };

  const complete = !!(
    profile?.name &&
    profile.surname &&
    profile.birthDay &&
    profile.sex
  );
  const name = [profile?.name, profile?.surname].filter(Boolean).join(' ');

  return (
    <PageLayout
      title={t('profile.title')}
      onBack={goBack}
      contentStyle={styles.content}
    >
      {isPending ? (
        <LoadingMore loading />
      ) : !profile ? (
        <EmptyState
          icon="user"
          title={t('lineup.emptyTitle')}
          text={t(getApiErrorMessageKey(error))}
        />
      ) : (
        <>
          {complete ? null : <Notice text={t('profile.fillNotice')} />}
          <ProfileCard
            name={name || profile.email}
            photo={profile.smallPhoto}
            level={complete ? level : null}
            onEdit={() => router.push('/profile/edit')}
            onChangePhoto={() => void changePhoto()}
            photoUploading={setPhoto.isPending}
          />
          <SquadBlock
            boxed
            title={t('profile.favoritePlayer')}
            initialPlayerId={profile.favoritePlayer?.toString()}
            renderAction={(player) =>
              profile.favoritePlayer === playerId(player) ? (
                // The current favourite: a label, not an action.
                <Button
                  size="xs"
                  fullWidth
                  backgroundColor="brand"
                  textColor="onBrand"
                  icon="starFilled"
                  text={t('profile.favoritePlayer')}
                  accessibilityState={{ selected: true }}
                />
              ) : (
                <Button
                  size="xs"
                  fullWidth
                  backgroundColor="brand"
                  textColor="onBrand"
                  icon="starEmpty"
                  text={t('profile.makeFavorite')}
                  onPress={() =>
                    editProfile.mutate({ favoritePlayer: playerId(player) })
                  }
                />
              )
            }
          />
          <MenuRow
            icon="tShirt"
            label={t('profile.size')}
            value={size ?? undefined}
            onPress={() => setSizeOpen(true)}
          />
          <MenuRow
            icon="logout"
            tone="destructive"
            label={t('profile.logout')}
            onPress={() => logout.mutate()}
          />
          <BottomSheet
            visible={sizeOpen}
            onClose={() => setSizeOpen(false)}
            title={t('profile.size')}
          >
            <ChoiceGroup
              variant="list"
              options={CLOTHING_SIZES.map((s) => ({ label: s, value: s }))}
              value={size}
              onChange={(next) => {
                setSize(next);
                setSizeOpen(false);
              }}
            />
          </BottomSheet>
        </>
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing(3),
    paddingHorizontal: theme.spacing(4),
  },
}));
