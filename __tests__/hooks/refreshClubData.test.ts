import { QueryClient } from '@tanstack/react-query';

import { refreshClubData } from '@/hooks/query/clubs/refreshClubData';

import { QueryKey } from '@/types';

describe('refreshClubData', () => {
  it('refetches the clubs and the app-wide event lists', async () => {
    const queryClient = new QueryClient();
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');

    await refreshClubData(queryClient);

    expect(invalidate).toHaveBeenCalledWith({ queryKey: [QueryKey.Clubs] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: [QueryKey.Events] });
  });
});
