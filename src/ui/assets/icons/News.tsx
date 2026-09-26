import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgNews = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.5 6.667a4.167 4.167 0 0 1 0 6.666M14.75 4.167a7.5 7.5 0 0 1 0 11.666M5 12.5H3.333a.833.833 0 0 1-.833-.833V8.333a.833.833 0 0 1 .833-.833H5l2.917-3.75a.667.667 0 0 1 1.25.417v11.666a.667.667 0 0 1-1.25.417z"
    />
  </Svg>
);
export default SvgNews;
