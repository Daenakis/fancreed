import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgUpload = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.333 14.167v1.666A1.666 1.666 0 0 0 5 17.5h10a1.667 1.667 0 0 0 1.667-1.667v-1.666M5.833 7.5 10 3.333 14.167 7.5M10 3.333v10"
    />
  </Svg>
);
export default SvgUpload;
