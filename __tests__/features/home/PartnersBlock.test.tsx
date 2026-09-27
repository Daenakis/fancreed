import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';

import { sponsorsApi } from '@/api';

import type { Sponsor } from '@/types/api';

import { PartnersBlock } from '@/features/home';

const sponsor = (id: string): Sponsor => ({
  _id: id,
  name: `Partner ${id}`,
  url: `https://${id}.example.com`,
  image: `https://x/${id}.png`,
});

const mockSponsors = (list: Sponsor[]) =>
  jest
    .spyOn(sponsorsApi, 'list')
    .mockResolvedValue(apiOk({ sponsors: [{ _id: 'g', sponsors: list }] }));

describe('PartnersBlock', () => {
  it('shows the partners and opens the pressed one', async () => {
    mockSponsors([sponsor('a'), sponsor('b')]);
    const onOpenPartner = jest.fn();
    const { findByRole } = render(
      <PartnersBlock onOpenPartner={onOpenPartner} />,
    );

    fireEvent.press(await findByRole('button', { name: 'Partner b' }));

    expect(onOpenPartner).toHaveBeenCalledWith(sponsor('b'));
  });

  it('renders nothing without partners', async () => {
    mockSponsors([]);
    const { toJSON } = render(<PartnersBlock onOpenPartner={jest.fn()} />);

    await waitFor(() => expect(toJSON()).toBeNull());
  });
});
