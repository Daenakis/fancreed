import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { RemoteImage, Text } from '@/ui/components';

import { pitchRows, shortName } from '@/utils';

import type { PitchPlaceProps, PitchProps } from './types';

/**
 * Half a football pitch with a line-up in formation: attack at the top,
 * goalkeeper at the bottom by the penalty area. Empty places show a
 * placeholder (line-up prediction).
 */
export function Pitch({ slots, onPressSlot, emptyLabel, style }: PitchProps) {
  const rows = pitchRows(slots);

  return (
    <View style={[styles.pitch, style]}>
      <View style={styles.centreCircle} />
      <View style={styles.penaltyArea}>
        <View style={styles.goalArea} />
      </View>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((slot) => (
            <PitchPlace
              key={slot.grid}
              slot={slot}
              emptyLabel={emptyLabel}
              onPress={onPressSlot}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

Pitch.displayName = 'Pitch';

function PitchPlace({ slot, emptyLabel, onPress }: PitchPlaceProps) {
  const { player } = slot;
  const name = player ? (player.actualName ?? player.name) : null;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={name ? `${name}, ${player!.number}` : emptyLabel}
      disabled={!onPress}
      onPress={() => onPress?.(slot)}
      style={styles.player}
    >
      {player ? (
        <RemoteImage
          source={{ uri: player.actualPhoto ?? player.photo }}
          resizeMode="cover"
          style={styles.photo}
        />
      ) : (
        <View style={[styles.photo, styles.empty]} />
      )}
      <Text
        variant="bodyXSMedium"
        color="onBrand"
        numberOfLines={2}
        style={styles.caption}
      >
        {name ? `${shortName(name)} (${player!.number})` : emptyLabel}
      </Text>
    </Pressable>
  );
}

const LINE = 1;

const styles = StyleSheet.create((theme) => ({
  pitch: {
    height: 520,
    overflow: 'hidden',
    justifyContent: 'space-around',
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(2),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.brand,
  },
  centreCircle: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: theme.radius.full,
    borderWidth: LINE,
    borderColor: theme.colors.brandBorder,
  },
  penaltyArea: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '55%',
    height: 90,
    borderWidth: LINE,
    borderBottomWidth: 0,
    borderColor: theme.colors.brandBorder,
  },
  goalArea: {
    width: '45%',
    height: 36,
    borderWidth: LINE,
    borderBottomWidth: 0,
    borderColor: theme.colors.brandBorder,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  player: {
    width: 76,
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  // 48 pt: easy to see and tap in line-up predictions.
  photo: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.onBrand,
    backgroundColor: theme.colors.background,
  },
  empty: {
    borderColor: theme.colors.brandBorder,
    backgroundColor: theme.colors.brandSurface,
  },
  caption: {
    textAlign: 'center',
  },
}));
