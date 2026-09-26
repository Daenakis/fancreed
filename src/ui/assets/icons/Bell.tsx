import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgBell = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.333 4.167a1.667 1.667 0 0 1 3.334 0 5.83 5.83 0 0 1 3.333 5v2.5a3.33 3.33 0 0 0 1.667 2.5H3.333A3.33 3.33 0 0 0 5 11.667v-2.5a5.83 5.83 0 0 1 3.333-5M7.5 14.167V15a2.5 2.5 0 0 0 5 0v-.833M17.5 5.606A9.2 9.2 0 0 0 15.172 2.5M2.5 5.606A9.2 9.2 0 0 1 4.827 2.5"
    />
  </Svg>
);
export default SvgBell;
