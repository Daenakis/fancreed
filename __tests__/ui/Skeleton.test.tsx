import { render } from '@tests/test-utils';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Skeleton } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

const blockStyle = (root: ReturnType<typeof render>) =>
  StyleSheet.flatten(
    root.UNSAFE_getAllByType(View).at(-1)!.props.style,
  ) as ViewStyle;

describe('Skeleton', () => {
  it('draws a grey block of the given size', () => {
    const root = render(<Skeleton width={40} height={12} />);

    expect(blockStyle(root)).toMatchObject({
      width: 40,
      height: 12,
      borderRadius: lightTheme.radius.sm,
      backgroundColor: lightTheme.colors.muted,
    });
  });

  it('rounds into a circle with radius full', () => {
    const root = render(<Skeleton width={40} height={40} radius="full" />);

    expect(blockStyle(root).borderRadius).toBe(lightTheme.radius.full);
  });

  it('is hidden from screen readers', () => {
    const { toJSON } = render(<Skeleton width={40} height={12} />);

    expect(toJSON()).toMatchObject({
      props: { accessibilityElementsHidden: true },
    });
  });
});
