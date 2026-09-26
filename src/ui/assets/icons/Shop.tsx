import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgShop = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.333 15.833a1.666 1.666 0 1 0 3.333 0 1.666 1.666 0 0 0-3.333 0M12.5 15.833a1.666 1.666 0 1 0 3.333 0 1.666 1.666 0 0 0-3.333 0"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.167 14.167H5V2.5H3.333"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5 4.167 16.667 5l-.834 5.833H5"
    />
  </Svg>
);
export default SvgShop;
