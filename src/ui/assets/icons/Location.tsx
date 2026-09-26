import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgLocation = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.5 9.167a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m14.714 13.88-3.536 3.537a1.667 1.667 0 0 1-2.355 0L5.286 13.88a6.666 6.666 0 1 1 9.428 0"
    />
  </Svg>
);
export default SvgLocation;
