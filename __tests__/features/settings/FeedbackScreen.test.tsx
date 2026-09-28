import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import { Alert } from 'react-native';

import { feedbackApi, profileApi } from '@/api';

import type { Profile } from '@/types/api';

import { FeedbackScreen } from '@/features/settings';

const profile: Profile = {
  email: 'fan@example.com',
  role: 'basic',
  name: 'Ivan',
  surname: 'Franko',
};

beforeEach(() => {
  jest.spyOn(profileApi, 'get').mockResolvedValue(apiOk(profile));
});

const fill = (getByLabelText: ReturnType<typeof render>['getByLabelText']) => {
  fireEvent.changeText(getByLabelText('feedback.name'), 'Ivan');
  fireEvent.changeText(getByLabelText('feedback.phone'), '+38 050 123 45 67');
  fireEvent.changeText(getByLabelText('feedback.message'), 'Great app!');
};

describe('FeedbackScreen', () => {
  it('keeps Send locked until name, phone and message are filled', () => {
    const { getByRole, getByLabelText } = render(<FeedbackScreen />);

    expect(getByRole('button', { name: 'feedback.send' })).toBeDisabled();

    fill(getByLabelText);

    expect(getByRole('button', { name: 'feedback.send' })).toBeEnabled();
  });

  it('sends the message with a clean phone number and thanks the fan', async () => {
    const send = jest.spyOn(feedbackApi, 'send');
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByRole, getByLabelText } = render(<FeedbackScreen />);

    fill(getByLabelText);
    fireEvent.press(getByRole('button', { name: 'feedback.send' }));

    await waitFor(() =>
      expect(send).toHaveBeenCalledWith({
        name: 'Ivan',
        phone: '+380501234567',
        message: 'Great app!',
      }),
    );
    await waitFor(() =>
      expect(alert).toHaveBeenCalledWith(
        'feedback.sentTitle',
        'feedback.sentText',
      ),
    );
  });

  it('shows an error for a phone number that is too short', async () => {
    const send = jest.spyOn(feedbackApi, 'send');
    const { getByRole, getByLabelText, findByText } = render(
      <FeedbackScreen />,
    );

    fill(getByLabelText);
    fireEvent.changeText(getByLabelText('feedback.phone'), '12345');
    fireEvent.press(getByRole('button', { name: 'feedback.send' }));

    expect(await findByText('feedback.errors.phoneInvalid')).toBeTruthy();
    expect(send).not.toHaveBeenCalled();
  });
});
