import { fireEvent, render } from '@tests/test-utils';

import { PageLayout, Text } from '@/ui/components';

describe('PageLayout', () => {
  it('shows the title as a header and the content', () => {
    const { getByRole, getByText } = render(
      <PageLayout title="Squad">
        <Text>Pitch</Text>
      </PageLayout>,
    );

    expect(getByRole('header', { name: 'Squad' })).toBeTruthy();
    expect(getByText('Pitch')).toBeTruthy();
  });

  it('calls onBack and onShare from the header buttons', () => {
    const onBack = jest.fn();
    const onShare = jest.fn();
    const { getByRole } = render(
      <PageLayout title="Article" onBack={onBack} onShare={onShare}>
        <Text>Body</Text>
      </PageLayout>,
    );

    fireEvent.press(getByRole('button', { name: 'common.back' }));
    fireEvent.press(getByRole('button', { name: 'common.share' }));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it('hides the header buttons without handlers', () => {
    const { queryByRole } = render(
      <PageLayout title="Table" scrollable={false}>
        <Text>Rows</Text>
      </PageLayout>,
    );

    expect(queryByRole('button')).toBeNull();
  });
});
