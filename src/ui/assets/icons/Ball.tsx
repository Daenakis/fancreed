import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgBall = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.5 10a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m10 5.833 3.967 2.875-1.467 4.625h-5L6.033 8.708zM10 5.833V2.5m2.5 10.833 2.083 2.5m-.616-7.125L17.083 7.5M7.55 13.375l-2.133 2.458m.616-7.125L2.917 7.5"
    />
  </Svg>
);
export default SvgBall;
