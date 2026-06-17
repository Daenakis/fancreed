import { render } from '@tests/test-utils';

import { ICONS } from '@/ui/assets/icons';
import { Icon } from '@/ui/components';

describe('Icon', () => {
  it('returns null for an unknown icon name', () => {
    // @ts-expect-error -- testing invalid name on purpose
    const { toJSON } = render(<Icon name="nonExistentIcon" />);

    expect(toJSON()).toBeNull();
  });

  it('looks up the icon from the ICONS registry', () => {
    const spy = jest.fn((_props: Record<string, unknown>) => null);
    const original = ICONS.arrowRight;

    // Temporarily replace icon to verify it gets called
    (ICONS as Record<string, unknown>).arrowRight = spy;

    render(<Icon name="arrowRight" />);

    expect(spy).toHaveBeenCalled();

    (ICONS as Record<string, unknown>).arrowRight = original;
  });

  it('passes size and fill props to the SVG component', () => {
    const spy = jest.fn((_props: Record<string, unknown>) => null);
    (ICONS as Record<string, unknown>).arrowRight = spy;

    render(<Icon name="arrowRight" size={32} fill="#FF0000" />);

    const props = spy.mock.calls[0][0];
    expect(props.width).toBe(32);
    expect(props.height).toBe(32);
    expect(props.fill).toBe('#FF0000');

    (ICONS as Record<string, unknown>).arrowRight = jest.fn(
      (_props: Record<string, unknown>) => null,
    );
  });

  it('uses default size of 20 and fill of currentColor', () => {
    const spy = jest.fn((_props: Record<string, unknown>) => null);
    (ICONS as Record<string, unknown>).arrowRight = spy;

    render(<Icon name="arrowRight" />);

    const props = spy.mock.calls[0][0];
    expect(props.width).toBe(20);
    expect(props.height).toBe(20);
    expect(props.fill).toBe('currentColor');
  });
});
