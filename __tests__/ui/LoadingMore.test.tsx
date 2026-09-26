import { render } from '@tests/test-utils';
import { ActivityIndicator, StyleSheet, type ViewStyle } from 'react-native';

import { LoadingMore } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

describe('LoadingMore', () => {
  it('spins and is announced when loading', () => {
    const { getByLabelText, UNSAFE_getByType } = render(
      <LoadingMore loading />,
    );

    expect(getByLabelText('common.loading')).toBeTruthy();
    expect(UNSAFE_getByType(ActivityIndicator).props.animating).toBe(true);
  });

  it('keeps its space but stops spinning when not loading', () => {
    const { queryByLabelText, UNSAFE_getByType } = render(
      <LoadingMore loading={false} />,
    );

    expect(queryByLabelText('common.loading')).toBeNull();
    expect(UNSAFE_getByType(ActivityIndicator).props.animating).toBe(false);
  });

  it('uses the muted colour by default and the given theme colour otherwise', () => {
    const { UNSAFE_getByType, rerender } = render(<LoadingMore loading />);
    expect(UNSAFE_getByType(ActivityIndicator).props.color).toBe(
      lightTheme.colors.mutedForeground,
    );

    rerender(<LoadingMore loading color="primary" />);

    expect(UNSAFE_getByType(ActivityIndicator).props.color).toBe(
      lightTheme.colors.primary,
    );
  });

  it('uses the horizontal layout when horizontal', () => {
    const { UNSAFE_getByType } = render(<LoadingMore loading horizontal />);
    const container = UNSAFE_getByType(ActivityIndicator).parent!;

    expect(
      (StyleSheet.flatten(container.props.style) as ViewStyle).marginRight,
    ).toBe(lightTheme.spacing(6));
  });
});
