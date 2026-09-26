import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgSort = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.167 7.5 5.833 4.167 2.5 7.5m3.333-3.333v11.666M10.833 12.5l3.334 3.333L17.5 12.5m-3.333 3.333V4.167"
    />
  </Svg>
);
export default SvgSort;
