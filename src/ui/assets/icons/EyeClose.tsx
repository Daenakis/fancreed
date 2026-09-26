import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgEyeClose = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.5 7.5q-3 3.334-7.5 3.333T2.5 7.5M2.5 12.5l2.083-3.167M17.5 12.48l-2.077-3.147M7.5 14.167l.417-3.334M12.5 14.167l-.417-3.334"
    />
  </Svg>
);
export default SvgEyeClose;
