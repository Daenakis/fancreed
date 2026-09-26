import { fireEvent, render } from '@tests/test-utils';

import { SocialSignIn } from '@/features/auth/components';

describe('SocialSignIn', () => {
  it('renders a button per provider by default', () => {
    const { getAllByRole } = render(<SocialSignIn onPress={jest.fn()} />);

    expect(getAllByRole('button')).toHaveLength(3);
  });

  it('calls onPress with the provider when its button is pressed', () => {
    const onPress = jest.fn();
    const { getAllByRole } = render(
      <SocialSignIn onPress={onPress} providers={['apple']} />,
    );

    fireEvent.press(getAllByRole('button')[0]);

    expect(onPress).toHaveBeenCalledWith('apple');
  });
});
