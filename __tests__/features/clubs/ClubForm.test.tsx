import { fireEvent, render, waitFor } from '@tests/test-utils';

import { ClubForm } from '@/features/clubs';

const fillRequired = (utils: ReturnType<typeof render>, name = 'Knights') => {
  fireEvent.changeText(utils.getByLabelText('club.name'), name);
  fireEvent.changeText(
    utils.getByLabelText('club.address'),
    'Lviv, Stadium street 1',
  );
  fireEvent.changeText(
    utils.getByLabelText('club.description'),
    'Yellow-black knights',
  );
};

describe('ClubForm', () => {
  it('keeps Save disabled until the required fields have text', async () => {
    const utils = render(<ClubForm onSubmit={jest.fn()} />);
    const save = utils.getByRole('button', { name: 'club.save' });
    expect(save).toBeDisabled();

    fillRequired(utils);

    await waitFor(() =>
      expect(utils.getByRole('button', { name: 'club.save' })).toBeEnabled(),
    );
  });

  it('submits valid values with the chosen visibility', async () => {
    const onSubmit = jest.fn();
    const utils = render(<ClubForm onSubmit={onSubmit} />);

    fillRequired(utils);
    fireEvent.press(utils.getByRole('radio', { name: 'club.friends' }));
    fireEvent.press(utils.getByRole('button', { name: 'club.save' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Knights', visibility: 'friends' }),
        undefined,
      ),
    );
  });

  it('shows errors only after Save is pressed', async () => {
    const onSubmit = jest.fn();
    const utils = render(<ClubForm onSubmit={onSubmit} />);

    fillRequired(utils, 'K');
    fireEvent.changeText(utils.getByLabelText('club.facebook'), 'facebook.com');
    expect(utils.queryByText('club.errors.nameLength')).toBeNull();

    fireEvent.press(utils.getByRole('button', { name: 'club.save' }));

    expect(await utils.findByText('club.errors.nameLength')).toBeTruthy();
    expect(utils.getByText('club.errors.linkInvalid')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('opens the photo picker when one is provided', () => {
    const onPickPhoto = jest.fn();
    const { getByRole } = render(
      <ClubForm onSubmit={jest.fn()} onPickPhoto={onPickPhoto} />,
    );

    fireEvent.press(getByRole('button', { name: 'photo.add' }));

    expect(onPickPhoto).toHaveBeenCalledTimes(1);
  });
});
