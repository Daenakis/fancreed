import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgXTwitter = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m3.333 3.333 9.778 13.334h3.556L6.889 3.333zM3.333 16.667l5.64-5.64m2.05-2.05 5.644-5.644"
    />
  </Svg>
);
export default SvgXTwitter;
