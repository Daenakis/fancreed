import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgTable = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.5 4.167A1.667 1.667 0 0 1 4.167 2.5h11.666A1.666 1.666 0 0 1 17.5 4.167v11.666a1.666 1.666 0 0 1-1.667 1.667H4.167A1.667 1.667 0 0 1 2.5 15.833zM2.5 8.333h15M8.333 2.5v15"
    />
  </Svg>
);
export default SvgTable;
