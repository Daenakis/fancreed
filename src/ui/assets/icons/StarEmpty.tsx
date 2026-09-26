import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgStarEmpty = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m10 14.792-5.143 2.704.982-5.728-4.167-4.056 5.75-.833 2.572-5.21 2.572 5.21 5.75.834-4.167 4.055.983 5.728z"
    />
  </Svg>
);
export default SvgStarEmpty;
