import type { AxiosResponse } from 'axios';

import { axiosInstance, profileApi } from '@/api';

const respond = (data: object) => Promise.resolve({ data } as AxiosResponse);

describe('profileApi', () => {
  it('turns the populated favourite player into its id', async () => {
    jest
      .spyOn(axiosInstance, 'get')
      .mockReturnValue(respond({ email: 'a@b.c', favoritePlayer: { _id: 7 } }));

    const { data } = await profileApi.get();

    expect(data.favoritePlayer).toBe(7);
  });

  it('keeps a plain id or an empty favourite as is', async () => {
    jest
      .spyOn(axiosInstance, 'post')
      .mockReturnValueOnce(respond({ favoritePlayer: 7 }))
      .mockReturnValueOnce(respond({ favoritePlayer: null }));

    expect((await profileApi.edit({})).data.favoritePlayer).toBe(7);
    expect((await profileApi.edit({})).data.favoritePlayer).toBeNull();
  });
});
