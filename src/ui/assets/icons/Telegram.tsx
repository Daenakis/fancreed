import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgTelegram = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m12.5 8.333-3.333 3.334 5 5L17.5 3.333l-15 5.834 3.333 1.666 1.667 5L10 12.5"
    />
  </Svg>
);
export default SvgTelegram;
