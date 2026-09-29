import { fireEvent, render } from '@tests/test-utils';

import { SocialLinks } from '@/ui/components';

const links = [
  { name: 'facebook', url: 'https://facebook.com/club' },
  { name: 'instagram', url: 'https://instagram.com/club' },
  { name: 'youtube', url: '' },
  { name: 'advert', url: 'https://shop.example.com' },
];

describe('SocialLinks', () => {
  it('shows known networks with a link and skips empty or unknown ones', () => {
    const { getAllByRole, getByRole } = render(
      <SocialLinks links={links} onOpen={jest.fn()} />,
    );

    expect(getAllByRole('link')).toHaveLength(2);
    expect(getByRole('link', { name: 'Instagram' })).toBeTruthy();
  });

  it('shows a twitter link as X', () => {
    const { getByRole } = render(
      <SocialLinks
        links={[{ name: 'twitter', url: 'https://x.com/club' }]}
        onOpen={jest.fn()}
      />,
    );

    expect(getByRole('link', { name: 'X' })).toBeTruthy();
  });

  it('calls onOpen with the pressed link', () => {
    const onOpen = jest.fn();
    const { getByRole } = render(<SocialLinks links={links} onOpen={onOpen} />);

    fireEvent.press(getByRole('link', { name: 'Facebook' }));

    expect(onOpen).toHaveBeenCalledWith(links[0]);
  });

  it('shows the header when title is set', () => {
    const { getByRole } = render(
      <SocialLinks links={links} onOpen={jest.fn()} title="Our socials" />,
    );

    expect(getByRole('header')).toBeTruthy();
  });

  it('renders nothing when there is no link to show', () => {
    const { toJSON } = render(
      <SocialLinks links={[{ name: 'advert', url: 'x' }]} onOpen={jest.fn()} />,
    );

    expect(toJSON()).toBeNull();
  });
});
