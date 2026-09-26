import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgPlay = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      fill="currentColor"
      d="M5 3.333v13.334a.834.834 0 0 0 1.27.71l10.833-6.667a.833.833 0 0 0 0-1.42L6.27 2.623a.833.833 0 0 0-1.27.71"
    />
  </Svg>
);
export default SvgPlay;
