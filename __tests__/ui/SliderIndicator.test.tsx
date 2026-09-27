import { render } from '@tests/test-utils';
import { StyleSheet, type ViewStyle } from 'react-native';

import { SliderIndicator } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

const dotColors = (utils: ReturnType<typeof render>) =>
  utils.getByLabelText('common.slideOf').children.map((dot) => {
    if (typeof dot === 'string') return undefined;
    return (StyleSheet.flatten(dot.props.style) as ViewStyle).backgroundColor;
  });

describe('SliderIndicator', () => {
  it('renders one dot per slide', () => {
    const utils = render(<SliderIndicator count={4} active={0} />);

    expect(dotColors(utils)).toHaveLength(4);
  });

  it('fills only the active dot with the default colours', () => {
    const utils = render(<SliderIndicator count={3} active={1} />);
    const { brand, border } = lightTheme.colors;

    expect(dotColors(utils)).toEqual([border, brand, border]);
  });

  it('applies the given theme colours', () => {
    const utils = render(
      <SliderIndicator
        count={2}
        active={0}
        activeColor="primary"
        inactiveColor="muted"
      />,
    );

    expect(dotColors(utils)).toEqual([
      lightTheme.colors.primary,
      lightTheme.colors.muted,
    ]);
  });

  it('renders nothing but the row when count is 0', () => {
    const utils = render(<SliderIndicator count={0} active={0} />);

    expect(dotColors(utils)).toHaveLength(0);
  });
});
