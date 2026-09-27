import { Image, Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import { pitchRows, shortName } from '@/utils';

import type { PitchPlayerProps, PitchProps } from './types';

/**
 * Half a football pitch with the starting XI in formation: attack at the
 * top, goalkeeper at the bottom by the penalty area.
 */
export function Pitch({ players, onPressPlayer, style }: PitchProps) {
  const rows = pitchRows(players);

  return (
    <View style={[styles.pitch, style]}>
      <View style={styles.centreCircle} />
      <View style={styles.penaltyArea}>
        <View style={styles.goalArea} />
      </View>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((player) => (
            <PitchPlayer
              key={player._id}
              player={player}
              onPress={onPressPlayer}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

Pitch.displayName = 'Pitch';

function PitchPlayer({ player, onPress }: PitchPlayerProps) {
  const name = player.actualName ?? player.name;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${name}, ${player.number}`}
      disabled={!onPress}
      onPress={() => onPress?.(player)}
      style={styles.player}
    >
      <Image
        source={{ uri: player.actualPhoto ?? player.photo }}
        resizeMode="cover"
        style={styles.photo}
      />
      <Text
        variant="bodyXSMedium"
        color="onBrand"
        numberOfLines={2}
        style={styles.caption}
      >
        {shortName(name)} ({player.number})
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
  photo: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.onBrand,
    backgroundColor: theme.colors.background,
  },
  caption: {
    textAlign: 'center',
  },
}));
