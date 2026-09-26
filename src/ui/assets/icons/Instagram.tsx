import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgInstagram = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.333 6.667a3.333 3.333 0 0 1 3.334-3.334h6.666a3.333 3.333 0 0 1 3.334 3.334v6.666a3.333 3.333 0 0 1-3.334 3.334H6.667a3.333 3.333 0 0 1-3.334-3.334z"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.5 10a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0M13.75 6.25v.008"
    />
  </Svg>
);
export default SvgInstagram;
