import { render } from '@tests/test-utils';

import { EmptyState } from '@/ui/components';

describe('EmptyState', () => {
  it('shows the title as a header and the text', () => {
    const { getByRole, getByText } = render(
      <EmptyState icon="shop" title="Coming soon" text="On its way" />,
    );

    expect(getByRole('header', { name: 'Coming soon' })).toBeTruthy();
    expect(getByText('On its way')).toBeTruthy();
  });

  it('renders without text', () => {
    const { queryByText } = render(<EmptyState icon="shop" title="Empty" />);

    expect(queryByText('On its way')).toBeNull();
  });
});
