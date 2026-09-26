import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgList = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.5 5h9.167M7.5 10h9.167M7.5 15h9.167M4.167 5v.008M4.167 10v.008M4.167 15v.008"
    />
  </Svg>
);
export default SvgList;
