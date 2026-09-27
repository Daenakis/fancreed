import { toCreateClubRequest } from '@/utils';

import type { ClubFormValues } from '@/schemas';

const values: ClubFormValues = {
  name: 'Knights',
  visibility: 'friends',
  address: 'Lviv, Stadium street 1',
  description: 'Yellow-black knights',
  facebook: 'https://facebook.com/knights',
  instagram: '',
  telegram: '',
};

describe('toCreateClubRequest', () => {
  it('maps the form to the API body and drops empty links', () => {
    expect(toCreateClubRequest(values)).toEqual({
      name: 'Knights',
      opened: false,
      visible: true,
      description: 'Yellow-black knights',
      address: 'Lviv, Stadium street 1',
      facebook: 'https://facebook.com/knights',
      instagram: undefined,
      telegram: undefined,
      logo: undefined,
    });
  });

  it('marks the club open when anyone can join and passes the logo', () => {
    const logo = { mimeType: 'image/jpeg', data: 'abc' };

    expect(
      toCreateClubRequest({ ...values, visibility: 'open' }, logo),
    ).toMatchObject({ opened: true, logo });
  });
});
