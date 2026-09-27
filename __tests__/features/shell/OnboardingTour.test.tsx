import { fireEvent, render } from '@tests/test-utils';

import { OnboardingTour } from '@/features/shell/components';

const next = (getByRole: ReturnType<typeof render>['getByRole']) =>
  fireEvent.press(getByRole('button', { name: 'onboarding.next' }));

describe('OnboardingTour', () => {
  it('starts on the menu step with no Back button', () => {
    const { getByRole, queryByRole, getByText } = render(<OnboardingTour />);

    expect(getByRole('header', { name: 'onboarding.menu.title' })).toBeTruthy();
    expect(getByText('onboarding.menu.text')).toBeTruthy();
    expect(queryByRole('button', { name: 'onboarding.back' })).toBeNull();
  });

  it('goes forward and back through the steps', () => {
    const { getByRole } = render(<OnboardingTour />);

    next(getByRole);
    expect(
      getByRole('header', { name: 'onboarding.profile.title' }),
    ).toBeTruthy();

    fireEvent.press(getByRole('button', { name: 'onboarding.back' }));
    expect(getByRole('header', { name: 'onboarding.menu.title' })).toBeTruthy();
  });

  it('can be skipped from any step but the last', () => {
    const onDone = jest.fn();
    const { getByRole, queryByRole } = render(
      <OnboardingTour onDone={onDone} />,
    );

    next(getByRole);
    fireEvent.press(getByRole('button', { name: 'onboarding.skip' }));

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(queryByRole('header')).toBeNull();
  });

  it('finishes after the sixth step and hides itself', () => {
    const onDone = jest.fn();
    const { getByRole, queryByRole } = render(
      <OnboardingTour onDone={onDone} />,
    );

    for (let step = 0; step < 5; step++) next(getByRole);
    expect(getByRole('header', { name: 'onboarding.shop.title' })).toBeTruthy();

    fireEvent.press(getByRole('button', { name: 'onboarding.finish' }));

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(queryByRole('header')).toBeNull();
  });
});
