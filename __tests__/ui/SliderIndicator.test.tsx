import { render } from '@tests/test-utils';
import { StyleSheet, type ViewStyle } from 'react-native';

import { SliderIndicator } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

// The drawn dot views (each animated Dot renders one native view).
const dotStyles = (utils: ReturnType<typeof render>) => {
  const row = utils.getByLabelText('common.slideOf');
  return row
    .findAll((node) => typeof node.type === 'string' && node !== row)
    .map((dot) => StyleSheet.flatten(dot.props.style) as ViewStyle);
};

const dotColors = (utils: ReturnType<typeof render>) =>
  dotStyles(utils).map((style) => style.backgroundColor);

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

  it('draws the active dot as a long pill and the others as short dashes', () => {
    const utils = render(<SliderIndicator count={3} active={2} />);

    expect(dotStyles(utils).map((style) => style.width)).toEqual([
      lightTheme.spacing(1.5),
      lightTheme.spacing(1.5),
      lightTheme.spacing(4),
    ]);
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
