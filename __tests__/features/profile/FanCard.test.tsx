import { fireEvent, render } from '@tests/test-utils';

import { FanCard, FanCardModal } from '@/features/profile';

const fan = {
  name: 'Andriy',
  surname: 'Melnyk',
  photo: 'https://example.com/me.png',
  season: '2025/2026',
};

describe('FanCard', () => {
  it('shows the fan, season and level when the profile has a name', () => {
    const { getByText } = render(<FanCard {...fan} />);

    expect(getByText('Andriy Melnyk')).toBeTruthy();
    expect(getByText('fanCard.season')).toBeTruthy();
    expect(getByText('fanCard.level')).toBeTruthy();
  });

  it('shows the progress to the next level when points are given', () => {
    const { getByText } = render(
      <FanCard {...fan} points={700} nextLevelPoints={2000} />,
    );

    expect(getByText('fanCard.toNextLevel')).toBeTruthy();
  });

  it('hides the progress at the top level', () => {
    const { queryByText } = render(
      <FanCard
        {...fan}
        loyaltyLevel="emerald"
        points={5000}
        nextLevelPoints={null}
      />,
    );

    expect(queryByText('fanCard.toNextLevel')).toBeNull();
  });

  it('asks to fill the profile and opens it when the name is missing', () => {
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

  it('calls onPress when the compact card is pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<FanCard {...fan} onPress={onPress} />);

    fireEvent.press(getByRole('button', { name: 'Andriy Melnyk' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows the card id on the back of the full card', () => {
    const { getByRole, getByLabelText } = render(
      <FanCard {...fan} variant="full" cardId="123" />,
    );

    expect(getByRole('button').props.accessibilityHint).toBe(
      'fanCard.flipHint',
    );
    expect(getByLabelText('fanCard.cardId')).toBeTruthy();
  });
});

describe('FanCardModal', () => {
  it('closes from the close button', () => {
    const onClose = jest.fn();
    const { getByRole } = render(
      <FanCardModal {...fan} visible onClose={onClose} />,
    );

    fireEvent.press(getByRole('button', { name: 'common.close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
