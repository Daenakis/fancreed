import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgLanguage = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.333 4.167h5.834M7.5 2.5v1.667c0 3.681-1.866 6.666-4.167 6.666"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4.167 7.5c0 1.787 2.46 3.257 5.583 3.333M10 16.667l3.333-7.5 3.334 7.5M15.917 15H10.75"
    />
  </Svg>
);
export default SvgLanguage;
