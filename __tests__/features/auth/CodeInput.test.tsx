import { fireEvent, render } from '@tests/test-utils';

import { CodeInput } from '@/features/auth/components';

describe('CodeInput', () => {
  it('renders one box per digit with the typed digits', () => {
    const { getAllByLabelText, getByText } = render(
      <CodeInput value="23" onChangeText={jest.fn()} />,
    );

    expect(getAllByLabelText(/auth.codeDigit/)).toHaveLength(6);
    expect(getByText('2')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });

  it('passes digits only, capped at the length, when text changes', () => {
    const onChangeText = jest.fn();
    const { getByLabelText } = render(
      <CodeInput value="" onChangeText={onChangeText} length={4} />,
    );

    fireEvent.changeText(getByLabelText('auth.codeTitle'), '1a2-345');

    expect(onChangeText).toHaveBeenCalledWith('1234');
  });

  it('renders without an error message when error is set', () => {
    const { queryByText } = render(
      <CodeInput value="" onChangeText={jest.fn()} error />,
    );

    expect(queryByText('auth.errors.invalidCode')).toBeNull();
  });

  it('marks the row busy when busy is set', () => {
    const { UNSAFE_root } = render(
      <CodeInput value="123456" onChangeText={jest.fn()} busy />,
    );

    const busyNodes = UNSAFE_root.findAll(
      (node) => node.props.accessibilityState?.busy === true,
    );
    expect(busyNodes.length).toBeGreaterThan(0);
  });
});
