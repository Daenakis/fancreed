import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgFacebookMono = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      fill="currentColor"
      d="M11.667 11.25h2.083l.833-3.333h-2.916V6.25c0-.858 0-1.667 1.666-1.667h1.25v-2.8a23 23 0 0 0-2.38-.116c-2.263 0-3.87 1.38-3.87 3.916v2.334h-2.5v3.333h2.5v7.083h3.334z"
    />
  </Svg>
);
export default SvgFacebookMono;
