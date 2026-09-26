import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgLogout = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.667 6.667V5A1.667 1.667 0 0 0 10 3.333H4.167A1.667 1.667 0 0 0 2.5 5v10a1.667 1.667 0 0 0 1.667 1.667H10A1.666 1.666 0 0 0 11.667 15v-1.667"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.5 10h10L15 7.5M15 12.5l2.5-2.5"
    />
  </Svg>
);
export default SvgLogout;
