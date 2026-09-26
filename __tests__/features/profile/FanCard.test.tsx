import { fireEvent, render } from '@tests/test-utils';
import { StyleSheet, type TextStyle } from 'react-native';

import { lightTheme } from '@/ui/theme/unistyles';

import { FanCard } from '@/features/profile';

const fan = {
  name: 'Andriy',
  surname: 'Melnyk',
  photo: 'https://example.com/me.png',
  season: '2025/2026',
};

describe('FanCard', () => {
  it('shows the fan, season and header when the profile is complete', () => {
    const { getByText } = render(<FanCard {...fan} />);

    expect(getByText('fanCard.title')).toBeTruthy();
    expect(getByText('Andriy\nMelnyk')).toBeTruthy();
    expect(getByText('fanCard.season\n2025/2026')).toBeTruthy();
  });

  it('falls back to the bronze level when loyaltyLevel is missing', () => {
    const { getByText } = render(<FanCard {...fan} />);
    const level = getByText('fanCard.level');

    expect((StyleSheet.flatten(level.props.style) as TextStyle).color).toBe(
      lightTheme.colors.loyaltyBronze,
    );
  });

  it('uses the colour of the given loyalty level', () => {
    const { getByText } = render(<FanCard {...fan} loyaltyLevel="gold" />);

    expect(
      (StyleSheet.flatten(getByText('fanCard.level').props.style) as TextStyle)
        .color,
    ).toBe(lightTheme.colors.loyaltyGold);
  });

  it('asks to fill the profile and opens it when data is missing', () => {
    const onOpenProfile = jest.fn();
    const { getByText, getByRole } = render(
      <FanCard
        season="2025/2026"
        name="Andriy"
        onOpenProfile={onOpenProfile}
      />,
    );

    expect(getByText('fanCard.empty')).toBeTruthy();
    fireEvent.press(getByRole('button', { name: 'fanCard.toProfile' }));

    expect(onOpenProfile).toHaveBeenCalledTimes(1);
  });

  it('opens the profile when the photo is pressed on the compact card', () => {
    const onOpenProfile = jest.fn();
    const { getByRole } = render(
      <FanCard {...fan} onOpenProfile={onOpenProfile} />,
    );

    fireEvent.press(getByRole('button', { name: 'Andriy Melnyk' }));

    expect(onOpenProfile).toHaveBeenCalledTimes(1);
  });

  it('can be flipped when it is the full card', () => {
    const { getByRole } = render(<FanCard {...fan} variant="full" />);

    const card = getByRole('button');
    fireEvent.press(card);

    expect(card.props.accessibilityHint).toBe('fanCard.flipHint');
  });
});
