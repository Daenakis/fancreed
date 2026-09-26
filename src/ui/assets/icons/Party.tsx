import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgParty = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.333 4.167H5M4.167 3.333V5M9.583 3.333 9.167 5M15 4.167h1.667M15.833 3.333V5M12.5 7.5l-.833.833M15 10.833l1.667-.416M15 15.833h1.667M15.833 15v1.667M11.667 13.765 6.235 8.333l-3.658 7.984a.833.833 0 0 0 1.107 1.107z"
    />
  </Svg>
);
export default SvgParty;
