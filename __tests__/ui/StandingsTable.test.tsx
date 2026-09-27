import { render } from '@tests/test-utils';
import { StyleSheet, type ViewStyle } from 'react-native';

import { type StandingsRowData, StandingsTable } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

const row = (
  teamId: number,
  rank: number,
  teamName: string,
): StandingsRowData => ({
  teamId,
  rank,
  teamName,
  teamLogo: `https://example.com/${teamId}.png`,
  played: 19,
  won: 12,
  drawn: 4,
  lost: 3,
  points: 40,
});

const rows = [row(1, 1, 'Dynamo'), row(3632, 2, 'Rukh')];

describe('StandingsTable', () => {
  it('renders the header columns', () => {
    const { getByText } = render(<StandingsTable rows={[]} />);

    ['standings.place', 'standings.club', 'standings.points'].forEach((key) =>
      expect(getByText(key)).toBeTruthy(),
    );
  });

  it('renders one accessible row per team', () => {
    const { getAllByLabelText, getByText } = render(
      <StandingsTable rows={rows} />,
    );

    expect(getAllByLabelText('standings.rowLabel')).toHaveLength(2);
    expect(getByText('Dynamo')).toBeTruthy();
    expect(getByText('Rukh')).toBeTruthy();
  });

  it('highlights only our team row in yellow', () => {
    const { getAllByLabelText } = render(
      <StandingsTable rows={rows} highlightTeamId={3632} />,
    );
    const backgrounds = getAllByLabelText('standings.rowLabel').map(
      (row) =>
        (StyleSheet.flatten(row.props.style) as ViewStyle).backgroundColor,
    );

    expect(
      backgrounds.filter((color) => color === lightTheme.colors.highlight),
    ).toHaveLength(1);
  });

  it('renders no logo image when the logo is missing', () => {
    const { getByText } = render(
      <StandingsTable rows={[{ ...row(5, 3, 'Veres'), teamLogo: null }]} />,
    );

    expect(getByText('Veres')).toBeTruthy();
  });
});
