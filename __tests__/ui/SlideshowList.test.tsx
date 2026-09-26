import { act, fireEvent, render } from '@tests/test-utils';
import { AccessibilityInfo, FlatList, Text } from 'react-native';

import { SlideshowList } from '@/ui/components';

const items = ['A', 'B', 'C'];

const setup = (props: Partial<Parameters<typeof SlideshowList>[0]> = {}) => {
  const utils = render(
    <SlideshowList
      data={items}
      renderItem={({ item }) => <Text>{item as string}</Text>}
      keyExtractor={(item) => item as string}
      intervalMs={1000}
      resumeAfterMs={3000}
      {...props}
    />,
  );
  const list = utils.UNSAFE_getByType(FlatList);
  const scrollToIndex = jest
    .spyOn(list.instance, 'scrollToIndex')
    .mockImplementation(() => {});
  return { ...utils, list, scrollToIndex };
};

beforeEach(() => {
  jest.useFakeTimers();
  jest
    .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
    .mockResolvedValue(false);
});
afterEach(() => jest.useRealTimers());

describe('SlideshowList', () => {
  it('renders the items', () => {
    const { getByText } = setup();

    expect(getByText('A')).toBeTruthy();
  });

  const indexes = (spy: jest.SpyInstance) =>
    spy.mock.calls.map((call) => (call[0] as { index: number }).index);

  it('advances to the next item every interval', async () => {
    const { scrollToIndex } = setup();
    await act(async () => {});

    act(() => jest.advanceTimersByTime(2000));

    expect(indexes(scrollToIndex)).toEqual([1, 2]);
  });

  it('loops back to the start once the last item is visible', async () => {
    const { list, scrollToIndex } = setup();
    await act(async () => {});

    // The list reports that it shows the last two items (can't scroll further).
    act(() =>
      list.props.onViewableItemsChanged({
        viewableItems: [{ index: 1 }, { index: 2 }],
      }),
    );
    act(() => jest.advanceTimersByTime(1000));

    expect(indexes(scrollToIndex)).toEqual([0]);
  });

  it('pauses on touch and resumes after the quiet period', async () => {
    const { list, scrollToIndex } = setup();
    await act(async () => {});

    fireEvent(list, 'touchStart', {});
    act(() => jest.advanceTimersByTime(2500));
    expect(scrollToIndex).not.toHaveBeenCalled();

    // Quiet period ends at 3000 ms, then the next interval ticks.
    act(() => jest.advanceTimersByTime(500));
    act(() => jest.advanceTimersByTime(1000));
    expect(scrollToIndex).toHaveBeenCalledTimes(1);
  });

  it('does not auto-advance while a screen reader is on', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
      .mockResolvedValue(true);
    const { scrollToIndex } = setup();
    await act(async () => {});

    act(() => jest.advanceTimersByTime(5000));

    expect(scrollToIndex).not.toHaveBeenCalled();
  });
});
