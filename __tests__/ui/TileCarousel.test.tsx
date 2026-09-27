import { fireEvent, render } from '@tests/test-utils';

import { TileCarousel } from '@/ui/components';

const items = ['A', 'B', 'C', 'D'].map((name) => ({
  key: name,
  title: `Tile ${name}`,
  image: `https://x/${name}.png`,
}));

describe('TileCarousel', () => {
  it('renders every tile across pages with page dots', () => {
    const { getByText, getByLabelText } = render(
      <TileCarousel items={items} onPressItem={jest.fn()} />,
    );

    expect(getByText('Tile A')).toBeTruthy();
    expect(getByText('Tile D')).toBeTruthy();
    expect(getByLabelText('common.slideOf')).toBeTruthy();
  });

  it('calls onPressItem with the pressed tile', () => {
    const onPressItem = jest.fn();
    const { getByRole } = render(
      <TileCarousel items={items} onPressItem={onPressItem} />,
    );

    fireEvent.press(getByRole('button', { name: 'Tile B' }));

    expect(onPressItem).toHaveBeenCalledWith(items[1]);
  });

  it('adds a "+" tile when onAdd is set', () => {
    const onAdd = jest.fn();
    const { getByRole } = render(
      <TileCarousel
        items={items.slice(0, 1)}
        onPressItem={jest.fn()}
        onAdd={onAdd}
        addLabel="Create a club"
      />,
    );

    fireEvent.press(getByRole('button', { name: 'Create a club' }));

    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('renders nothing without items or add tile', () => {
    const { toJSON } = render(
      <TileCarousel items={[]} onPressItem={jest.fn()} />,
    );

    expect(toJSON()).toBeNull();
  });

  it('hides the captions when hideCaptions is set', () => {
    const { queryByText } = render(
      <TileCarousel items={items} onPressItem={jest.fn()} hideCaptions />,
    );

    expect(queryByText(items[0]!.title)).toBeNull();
  });
});
