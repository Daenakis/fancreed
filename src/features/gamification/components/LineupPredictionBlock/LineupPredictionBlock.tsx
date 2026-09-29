import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, Share, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import {
  BottomSheet,
  Button,
  Icon,
  RemoteImage,
  SectionTitle,
  Select,
  Skeleton,
  Text,
  TextInput,
} from '@/ui/components';

import {
  useBackendSquadQuery,
  useLineupPredictionQuery,
  useMakeLineupPredictionMutation,
  useNextMatchQuery,
  useSquadQuery,
} from '@/hooks';

import {
  backendSquadPhoto,
  formationGrid,
  FORMATIONS,
  pitchRows,
} from '@/utils';

import type { LineupPrediction, Player } from '@/types/api';

import { Pitch, type PitchSlot } from '@/features/matches';

import type {
  LineupPredictionBlockProps,
  PlayerPickerProps,
  SavedPredictionProps,
} from './types';

/**
 * "Line-up prediction" for the next match: pick a formation, fill the eleven
 * places from the squad, then vote — the saved line-up shows with Share.
 * Hidden when there's no upcoming match.
 */
export function LineupPredictionBlock({ style }: LineupPredictionBlockProps) {
  const { t } = useTranslation();
  const { data: clubSquad } = useSquadQuery();
  const { data: backendSquad } = useBackendSquadQuery();
  // api-football headshots fit the small round photos; the club site's
  // cut-out stays for players the backend doesn't list.
  const squad = useMemo(
    () =>
      clubSquad?.map((player) => ({
        ...player,
        photo: backendSquadPhoto(player, backendSquad) ?? player.photo,
      })),
    [clubSquad, backendSquad],
  );
  const [formation, setFormation] = useState<string | null>(null);
  const [picked, setPicked] = useState<Record<string, Player>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const { data: matches, isPending: matchPending } = useNextMatchQuery();
  const match = matches?.next;
  const { data: saved, isLoading: savedLoading } = useLineupPredictionQuery(
    match?._id,
  );
  const make = useMakeLineupPredictionMutation();

  const grid = formation ? formationGrid(formation) : [];
  const slots: PitchSlot[] = grid.map((g) => ({
    grid: g,
    player: picked[g] ? { ...picked[g], grid: g } : null,
  }));
  const complete = grid.length > 0 && grid.every((g) => picked[g]);

  const vote = () =>
    match &&
    formation &&
    make.mutate({
      fixture: match._id,
      formation,
      players: grid.map((g) => {
        const player = picked[g]!;
        return {
          grid: g,
          name: player.actualName ?? player.name,
          number: player.number,
          photo: player.actualPhoto ?? player.photo,
        };
      }),
    });

  if (matchPending || savedLoading) {
    return (
      <View style={[styles.block, style]}>
        <SectionTitle
          title={t('lineupPrediction.title')}
          style={styles.flush}
        />
        <Skeleton height={SELECT_HEIGHT} radius="md" />
      </View>
    );
  }
  if (!match) return null;

  const shareLineup = (prediction: LineupPrediction) =>
    void Share.share({
      message: t('lineupPrediction.shareMessage', {
        formation: prediction.formation,
        players: pitchRows(prediction.players)
          .reverse()
          .flat()
          .map((p) => p.name)
          .join(', '),
      }),
    });

  return (
    <View style={[styles.block, style]}>
      <SectionTitle
        title={t('lineupPrediction.title')}
        action={
          saved
            ? {
                icon: 'telegram',
                label: t('common.share'),
                onPress: () => shareLineup(saved),
              }
            : undefined
        }
        style={styles.flush}
      />
      {saved ? (
        <SavedPrediction prediction={saved} />
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
                loading={make.isPending}
                onPress={vote}
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

/**
 * The fan's saved line-up: a collapsed row with the formation that opens
 * the pitch (Share is in the block title).
 */
function SavedPrediction({ prediction }: SavedPredictionProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const [open, setOpen] = useState(false);
  const slots: PitchSlot[] = prediction.players.map((p) => ({
    grid: p.grid,
    player: {
      _id: p.grid,
      _teamId: 0,
      name: p.name,
      number: p.number ?? 0,
      position: '',
      photo: p.photo ?? '',
      grid: p.grid,
    },
  }));

  // The pitch runs to the card's edges so it keeps the size it had while
  // picking; only the texts and the button are inset. It's only built
  // when opened: eleven photos the page doesn't need to load up front.
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${t('lineupPrediction.yours')}, ${prediction.formation}`}
        onPress={() => setOpen((o) => !o)}
        style={({ pressed }) => [
          styles.row,
          styles.inset,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.flex}>
          <Text variant="bodyLMedium">{t('lineupPrediction.yours')}</Text>
          <Text variant="bodySRegular" color="mutedForeground">
            {t('lineupPrediction.formation')} · {prediction.formation}
          </Text>
        </View>
        <Icon
          name={open ? 'arrowUp' : 'arrowDown'}
          size={20}
          color={theme.colors.foreground}
        />
      </Pressable>
      {open ? <Pitch slots={slots} /> : null}
    </View>
  );
}

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
            <RemoteImage
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

/** Height of the formation Select. */
const SELECT_HEIGHT = 48;

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
    paddingVertical: theme.spacing(3),
    overflow: 'hidden',
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.mintSurface,
  },
  inset: {
    paddingHorizontal: theme.spacing(3),
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
