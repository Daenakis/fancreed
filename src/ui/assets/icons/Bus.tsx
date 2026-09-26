import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgBus = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.333 14.167a1.667 1.667 0 1 0 3.334 0 1.667 1.667 0 0 0-3.334 0M13.333 14.167a1.667 1.667 0 1 0 3.334 0 1.667 1.667 0 0 0-3.334 0"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.333 14.167H1.667V5a.833.833 0 0 1 .833-.833h11.667c1.105 0 2.164.614 2.946 1.708.781 1.094 1.22 2.578 1.22 4.125v4.167h-1.666m-3.334 0H6.667"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.333 4.167 14.583 10h3.75M1.667 8.333h12.5M5.833 4.167v4.166M10 4.167v4.166"
    />
  </Svg>
);
export default SvgBus;
