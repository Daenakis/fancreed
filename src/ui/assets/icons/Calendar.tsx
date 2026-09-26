import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgCalendar = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.333 5.833A1.667 1.667 0 0 1 5 4.167h10a1.667 1.667 0 0 1 1.667 1.666v10A1.667 1.667 0 0 1 15 17.5H5a1.667 1.667 0 0 1-1.667-1.667zM13.333 2.5v3.333M6.667 2.5v3.333M3.333 9.167h13.334M5.833 11.667h.011M8.342 11.667h.005M10.842 11.667h.005M13.346 11.667h.005M10.846 14.167h.005M5.842 14.167h.005M8.342 14.167h.005"
    />
  </Svg>
);
export default SvgCalendar;
