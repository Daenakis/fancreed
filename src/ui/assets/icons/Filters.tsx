import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgFilters = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 5a1.667 1.667 0 1 0 3.333 0A1.667 1.667 0 0 0 10 5M3.333 5H10M13.333 5h3.334M5 10a1.667 1.667 0 1 0 3.333 0A1.667 1.667 0 0 0 5 10M3.333 10H5M8.333 10h8.334M12.5 15a1.667 1.667 0 1 0 3.333 0 1.667 1.667 0 0 0-3.333 0M3.333 15H12.5M15.833 15h.834"
    />
  </Svg>
);
export default SvgFilters;
