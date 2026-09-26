import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgChangeImage = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.5 3.333a.833.833 0 0 1 .833-.833h3.334a.833.833 0 0 1 .833.833v3.334a.833.833 0 0 1-.833.833H3.333a.833.833 0 0 1-.833-.833zM12.5 13.333a.833.833 0 0 1 .833-.833h3.334a.833.833 0 0 1 .833.833v3.334a.833.833 0 0 1-.833.833h-3.334a.833.833 0 0 1-.833-.833zM17.5 9.167v-2.5A1.667 1.667 0 0 0 15.833 5h-5m2.5-2.5-2.5 2.5 2.5 2.5M2.5 10.833v2.5A1.666 1.666 0 0 0 4.167 15h5m-2.5 2.5 2.5-2.5-2.5-2.5"
    />
  </Svg>
);
export default SvgChangeImage;
