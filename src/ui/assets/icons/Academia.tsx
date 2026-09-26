import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgAcademia = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.333 7.5 10 4.167 1.667 7.5 10 10.833zm0 0v5"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5 8.833v4.5c0 .663.527 1.3 1.464 1.768.938.469 2.21.732 3.536.732s2.598-.263 3.536-.732c.937-.469 1.464-1.105 1.464-1.768v-4.5"
    />
  </Svg>
);
export default SvgAcademia;
