import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgCalendarCheck = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.583 17.5H5a1.667 1.667 0 0 1-1.667-1.667v-10A1.667 1.667 0 0 1 5 4.167h10a1.667 1.667 0 0 1 1.667 1.666v5M13.333 2.5v3.333M6.667 2.5v3.333M3.333 9.167h13.334M12.5 15.833l1.667 1.667 3.333-3.333"
    />
  </Svg>
);
export default SvgCalendarCheck;
