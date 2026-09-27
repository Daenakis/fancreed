import { render } from '@tests/test-utils';

import { Notice } from '@/ui/components';

describe('Notice', () => {
  it('shows the text and reads it as one element', () => {
    const { getByText, getByLabelText } = render(
      <Notice text="Fill in your profile" />,
    );

    expect(getByText('Fill in your profile')).toBeTruthy();
    expect(getByLabelText('Fill in your profile')).toBeTruthy();
  });
});
