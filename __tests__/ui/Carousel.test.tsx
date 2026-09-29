import { act, fireEvent, render } from '@tests/test-utils';
import { FlatList, StyleSheet, Text, type ViewStyle } from 'react-native';

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

  describe('auto-play', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    const autoPlay = (onIndexChange = jest.fn()) =>
      render(
        <Carousel
          data={data}
          keyExtractor={(item) => item}
          renderItem={(item) => <Text>{item}</Text>}
          autoPlayMs={10_000}
          onIndexChange={onIndexChange}
        />,
      );

    it('moves to the next page every interval and loops back to the first', () => {
      const onIndexChange = jest.fn();
      autoPlay(onIndexChange);

      act(() => jest.advanceTimersByTime(9_999));
      expect(onIndexChange).not.toHaveBeenCalled();

      act(() => jest.advanceTimersByTime(1));
      act(() => jest.advanceTimersByTime(10_000));
      act(() => jest.advanceTimersByTime(10_000));

      expect(onIndexChange.mock.calls.map(([index]) => index)).toEqual([
        1, 2, 0,
      ]);
    });

    it('waits while the user drags', () => {
      const onIndexChange = jest.fn();
      const utils = autoPlay(onIndexChange);

      fireEvent(utils.UNSAFE_getByType(FlatList), 'scrollBeginDrag');
      act(() => jest.advanceTimersByTime(30_000));

      expect(onIndexChange).not.toHaveBeenCalled();
    });

    it('stays off without autoPlayMs', () => {
      const onIndexChange = jest.fn();
      setup(onIndexChange);

      act(() => jest.advanceTimersByTime(60_000));

      expect(onIndexChange).not.toHaveBeenCalled();
    });
  });

  it('starts the page at the screen gutter when align is start', () => {
    const { UNSAFE_getByType } = render(
      <Carousel
        data={data}
        keyExtractor={(item) => item}
        renderItem={(item) => <Text>{item}</Text>}
        itemWidth={300}
        align="start"
      />,
    );
    const content = StyleSheet.flatten(
      UNSAFE_getByType(FlatList).props.contentContainerStyle,
    ) as ViewStyle;

    // Window 750: 20 gutter, then room for the last 300-wide page to snap there.
    expect(content).toMatchObject({ paddingLeft: 20, paddingRight: 430 });
  });
});
