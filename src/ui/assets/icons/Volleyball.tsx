import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgVolleyball = (props: SvgProps) => (
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
      d="M10 10a6.67 6.67 0 0 0 6.667 3.333M6.25 11.25a10 10 0 0 0 7.083 5.417"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 10a6.67 6.67 0 0 0-6.22 4.107M10.793 6.128a10 10 0 0 0-8.234 3.425"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 10a6.67 6.67 0 0 0-.447-7.44M12.958 12.623a10 10 0 0 0 1.15-8.843"
    />
  </Svg>
);
export default SvgVolleyball;
