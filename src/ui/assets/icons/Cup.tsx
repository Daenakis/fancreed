import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgCup = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6.667 17.5h6.666M10 14.167V17.5M5.833 3.333h8.334M14.167 3.333V10a4.167 4.167 0 1 1-8.334 0V3.333"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.5 7.5a1.667 1.667 0 1 0 3.333 0 1.667 1.667 0 0 0-3.333 0M14.167 7.5a1.667 1.667 0 1 0 3.333 0 1.667 1.667 0 0 0-3.333 0"
    />
  </Svg>
);
export default SvgCup;
