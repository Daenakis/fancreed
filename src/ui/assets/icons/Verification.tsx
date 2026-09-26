import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgVerification = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.333 6.667V5A1.667 1.667 0 0 1 5 3.333h1.667M3.333 13.333V15A1.667 1.667 0 0 0 5 16.667h1.667M13.333 3.333H15A1.667 1.667 0 0 1 16.667 5v1.667M13.333 16.667H15A1.667 1.667 0 0 0 16.667 15v-1.667M7.5 8.333h.008M12.5 8.333h.008M7.917 12.5a2.916 2.916 0 0 0 4.166 0"
    />
  </Svg>
);
export default SvgVerification;
