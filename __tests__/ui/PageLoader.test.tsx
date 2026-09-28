import { render } from '@tests/test-utils';
import { Image, StyleSheet } from 'react-native';

import { PageLoader } from '@/ui/components';

describe('PageLoader', () => {
  it('announces a busy progress bar labelled as loading', () => {
    const { getByRole } = render(<PageLoader />);

    const loader = getByRole('progressbar');
    expect(loader.props.accessibilityState).toEqual({ busy: true });
    expect(loader.props.accessibilityLabel).toBeTruthy();
  });

  it('draws the logo at the given width with its height ratio', () => {
    const { UNSAFE_getByType } = render(<PageLoader size={60} />);

    const style = StyleSheet.flatten(UNSAFE_getByType(Image).props.style);
    expect(style).toMatchObject({ width: 60, height: 90 });
  });
});
