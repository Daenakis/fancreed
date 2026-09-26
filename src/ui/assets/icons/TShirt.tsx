import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgTShirt = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.5 3.333 17.5 5v4.167H15v6.666a.833.833 0 0 1-.833.834H5.833A.833.833 0 0 1 5 15.833V9.167H2.5V5l5-1.667a2.5 2.5 0 0 0 5 0"
    />
  </Svg>
);
export default SvgTShirt;
