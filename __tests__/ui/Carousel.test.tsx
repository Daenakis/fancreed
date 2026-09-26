import { fireEvent, render } from '@tests/test-utils';
import { FlatList, Text } from 'react-native';

import { Carousel } from '@/ui/components';

const data = ['one', 'two', 'three'];

const setup = (onIndexChange = jest.fn()) =>
  render(
    <Carousel
      data={data}
      keyExtractor={(item) => item}
      renderItem={(item) => <Text>{item}</Text>}
      onIndexChange={onIndexChange}
    />,
  );

// Test renderer window is 750 wide → page = 600, step = 612.
const swipeTo = (utils: ReturnType<typeof setup>, x: number) =>
  fireEvent(utils.UNSAFE_getByType(FlatList), 'momentumScrollEnd', {
    nativeEvent: { contentOffset: { x } },
  });

describe('Carousel', () => {
  it('renders every item with page dots on the first page', () => {
    const { getByText, getByLabelText } = setup();

    expect(getByText('one')).toBeTruthy();
    expect(getByLabelText('common.slideOf')).toBeTruthy();
  });

  it('reports the page the user lands on', () => {
    const onIndexChange = jest.fn();
    const utils = setup(onIndexChange);

    swipeTo(utils, 612 * 2);

    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it('does not report again when the page does not change', () => {
    const onIndexChange = jest.fn();
    const utils = setup(onIndexChange);

    swipeTo(utils, 10);

    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it('hides the dots for a single item', () => {
    const { queryByLabelText } = render(
      <Carousel
        data={['only']}
        keyExtractor={(item) => item}
        renderItem={(item) => <Text>{item}</Text>}
      />,
    );

    expect(queryByLabelText('common.slideOf')).toBeNull();
  });
});
