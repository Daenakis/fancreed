import { router } from 'expo-router';

import { goBack } from '@/utils';

describe('goBack', () => {
  it('pops the stack when there is a previous screen', () => {
    jest.mocked(router.canGoBack).mockReturnValue(true);

    goBack();

    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it('returns to Home when there is nothing to pop', () => {
    jest.mocked(router.canGoBack).mockReturnValue(false);

    goBack();

    expect(router.replace).toHaveBeenCalledWith('/');
  });
});
