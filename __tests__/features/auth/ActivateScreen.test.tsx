import { apiFail, apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import { AccessibilityInfo } from 'react-native';

import { authApi } from '@/api';

import { useAuthStore, usePendingActivationStore } from '@/store';

import { ActivateScreen } from '@/features/auth';

const typeCode = (utils: ReturnType<typeof render>, code: string) =>
  fireEvent.changeText(utils.getByLabelText('auth.codeTitle'), code);

beforeEach(() => {
  useAuthStore.setState({ accessToken: null });
  usePendingActivationStore.getState().setPending('user@mail.com', 'secret1');
});

describe('ActivateScreen', () => {
  it('shows the email the code was sent to', () => {
    const { getByText } = render(<ActivateScreen />);

    expect(getByText('auth.activateSubtitle')).toBeTruthy();
  });

  it('activates and signs in when the right code is entered', async () => {
    const activate = jest
      .spyOn(authApi, 'activate')
      .mockResolvedValue(apiOk(undefined));
    jest.spyOn(authApi, 'login').mockResolvedValue(
      apiOk({
        userId: 'u1',
        activated: true,
        userRole: 'basic',
        access_token: 'token-1',
        token_type: 'Bearer',
      }),
    );
    const utils = render(<ActivateScreen />);

    typeCode(utils, '1234');

    await waitFor(() =>
      expect(useAuthStore.getState().accessToken).toBe('token-1'),
    );
    expect(activate).toHaveBeenCalledWith({
      email: 'user@mail.com',
      code: '1234',
    });
    expect(usePendingActivationStore.getState().password).toBeNull();
  });

  it('clears the code and announces the error when the code is wrong', async () => {
    jest
      .spyOn(authApi, 'activate')
      .mockRejectedValue(apiFail(403, 'Wrong code'));
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    const utils = render(<ActivateScreen />);

    typeCode(utils, '0000');

    await waitFor(() =>
      expect(announce).toHaveBeenCalledWith('errors.api.wrongCode'),
    );
    expect(utils.getByLabelText('auth.codeTitle').props.value).toBe('');
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
