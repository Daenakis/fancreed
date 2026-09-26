import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgNothingFound = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.488 2.925a7.5 7.5 0 1 0 1.262 13.57c2.074-1.198 3.484-3.315 3.75-5.662M8.333 8.333h.009M11.667 6.667h.008"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 12.5q1.25-1.666 2.5-1.667M16.667 7.5v.008M16.667 5a1.67 1.67 0 0 0 .761-3.152 1.65 1.65 0 0 0-2.011.403"
    />
  </Svg>
);
export default SvgNothingFound;
