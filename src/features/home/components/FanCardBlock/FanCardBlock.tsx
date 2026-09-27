import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { LoadingMore, SectionTitle } from '@/ui/components';

import { useFanLevelQuery, useProfileQuery } from '@/hooks';

import { FanCard, FanCardModal } from '@/features/profile';

import type { FanCardBlockProps } from './types';

/**
 * Home-screen "FAN CARD": the fan's card from the profile and loyalty
 * status; tapping it opens the landscape card with the barcode.
 */
export function FanCardBlock({ onOpenProfile, style }: FanCardBlockProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const profile = useProfileQuery();
  const { data: fanLevel } = useFanLevelQuery();

  if (profile.isPending || !fanLevel) return <LoadingMore loading />;

  // Unverified accounts get 403 on profile/ — the card then asks to fill it.
  const card = {
    name: profile.data?.name,
    surname: profile.data?.surname,
    photo: profile.data?.smallPhoto,
    season: fanLevel.season,
    loyaltyLevel: fanLevel.level,
    points: fanLevel.points,
    nextLevelPoints: fanLevel.nextLevelPoints,
    cardId: fanLevel.cardId,
    onOpenProfile,
  };

  return (
    <View style={style}>
      <SectionTitle title={t('fanCard.title')} />
      <FanCard {...card} onPress={() => setOpen(true)} style={styles.card} />
      <FanCardModal {...card} visible={open} onClose={() => setOpen(false)} />
    </View>
  );
}

FanCardBlock.displayName = 'FanCardBlock';

const styles = StyleSheet.create((theme) => ({
  card: {
    marginHorizontal: theme.spacing(5),
  },
}));
