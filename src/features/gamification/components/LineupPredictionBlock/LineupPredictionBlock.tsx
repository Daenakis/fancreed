import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, Share, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  BottomSheet,
  Button,
  SectionTitle,
  Select,
  Text,
  TextInput,
} from '@/ui/components';

import { useSquadQuery } from '@/hooks';

import { formationGrid, FORMATIONS } from '@/utils';

import type { Player } from '@/types/api';

import { Pitch, type PitchSlot } from '@/features/matches';

import type { LineupPredictionBlockProps, PlayerPickerProps } from './types';

/**
 * "Line-up prediction": pick a formation, fill the eleven places from the
 * squad, then vote — the fan's line-up shows with Share.
 * TODO(backend): no line-up prediction API yet — the vote isn't saved.
 */
export function LineupPredictionBlock({ style }: LineupPredictionBlockProps) {
  const { t } = useTranslation();
  const { data: squad } = useSquadQuery();
  const [formation, setFormation] = useState<string | null>(null);
  const [picked, setPicked] = useState<Record<string, Player>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);

  const grid = formation ? formationGrid(formation) : [];
  const slots: PitchSlot[] = grid.map((g) => ({
    grid: g,
    player: picked[g] ? { ...picked[g], grid: g } : null,
  }));
  const complete = grid.length > 0 && grid.every((g) => picked[g]);

  const share = () =>
    void Share.share({
      message: t('lineupPrediction.shareMessage', {
        formation,
        players: grid
          .map((g) => picked[g]?.actualName ?? picked[g]?.name)
          .join(', '),
      }),
    });

  return (
    <View style={[styles.block, style]}>
      <SectionTitle title={t('lineupPrediction.title')} style={styles.flush} />
      {voted ? (
        <View style={styles.card}>
          <View style={styles.row}>
            <Text variant="bodyLMedium" style={styles.flex}>
              {t('lineupPrediction.yours')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySRegular" style={styles.flex}>
              {t('lineupPrediction.formation')}
            </Text>
            <Text variant="bodySSemibold">{formation}</Text>
          </View>
          <Pitch slots={slots} />
          <Button
            size="xs"
            fullWidth
            backgroundColor="brand"
            textColor="onBrand"
            text={t('votes.share')}
            onPress={share}
          />
        </View>
      ) : (
        <>
          <Select
            label={t('lineupPrediction.formation')}
            placeholder={t('lineupPrediction.pickFormation')}
            value={formation}
            onChange={(next) => {
              setFormation(next);
              setPicked({});
            }}
            options={Object.keys(FORMATIONS).map((f) => ({
              label: f,
              value: f,
            }))}
          />
          {formation ? (
            <>
              <Text variant="bodySRegular">
                {t('lineupPrediction.pickPlayers')}
              </Text>
              <Pitch
                slots={slots}
                emptyLabel={t('lineupPrediction.pickPlayer')}
                onPressSlot={(slot) => setEditing(slot.grid)}
              />
              <Button
                size="xs"
                fullWidth
                backgroundColor="brand"
                textColor="onBrand"
                text={t('lineupPrediction.vote')}
                disabled={!complete}
                onPress={() => setVoted(true)}
              />
            </>
          ) : null}
        </>
      )}
      <PlayerPicker
        visible={editing !== null}
        onClose={() => setEditing(null)}
        players={squad ?? []}
        takenIds={Object.entries(picked)
          .filter(([g]) => g !== editing)
          .map(([, p]) => p._id)}
        selectedId={editing ? picked[editing]?._id : undefined}
        onPick={(player) => {
          if (editing) setPicked((p) => ({ ...p, [editing]: player }));
          setEditing(null);
        }}
      />
    </View>
  );
}

LineupPredictionBlock.displayName = 'LineupPredictionBlock';

/** Squad list with a search field, in a bottom sheet. */
function PlayerPicker({
  visible,
  onClose,
  players,
  takenIds,
  selectedId,
  onPick,
}: PlayerPickerProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const list = players.filter((p) => {
    if (takenIds.includes(p._id)) return false;
    const name = (p.actualName ?? p.name).toLowerCase();
    return name.includes(query.trim().toLowerCase());
  });

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <TextInput
        placeholder={t('lineupPrediction.search')}
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
      />
      <FlatList
        data={list}
        keyExtractor={(p) => p._id}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={item.actualName ?? item.name}
            accessibilityState={{ selected: item._id === selectedId }}
            onPress={() => onPick(item)}
            style={({ pressed }) => [
              styles.option(item._id === selectedId),
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={{ uri: item.actualPhoto ?? item.photo }}
              style={styles.avatar}
            />
            <View style={styles.flex}>
              <Text variant="bodyMRegular">{item.actualName ?? item.name}</Text>
              <Text variant="bodyXSMedium" color="mutedForeground">
                {t(
                  `player.position.${item.position}` as 'player.position.Goalkeeper',
                  {
                    defaultValue: item.position,
                  },
                )}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  block: {
    gap: theme.spacing(3),
    paddingHorizontal: theme.spacing(5),
  },
  flush: {
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  card: {
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.mintSurface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  list: {
    maxHeight: 360,
  },
  option: (selected: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(3),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.radius.md,
    backgroundColor: selected
      ? theme.colors.mintSurfaceStrong
      : theme.colors.secondary,
  }),
  avatar: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.muted,
  },
  pressed: {
    opacity: 0.7,
  },
}));
