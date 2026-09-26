import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
const SvgTeam = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <G
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      clipPath="url(#a)"
    >
      <Path d="M4.167 5.833a3.333 3.333 0 1 0 6.666 0 3.333 3.333 0 0 0-6.666 0M2.5 17.5v-1.667A3.333 3.333 0 0 1 5.833 12.5h3.334a3.333 3.333 0 0 1 3.333 3.333V17.5M13.333 2.608a3.333 3.333 0 0 1 0 6.459M17.5 17.5v-1.667a3.33 3.33 0 0 0-2.5-3.208" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgTeam;
