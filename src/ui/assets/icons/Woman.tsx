import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgWoman = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.584 13.833v4.584M12.25 13.833v4.584M6.75 13.833h7.333L12.25 7.417H8.583zM4 9.25q2.292-1.833 4.583-1.833"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.833 9.25q-2.292-1.833-4.583-1.833M8.584 2.833a1.833 1.833 0 1 0 3.666 0 1.833 1.833 0 0 0-3.666 0"
    />
  </Svg>
);
export default SvgWoman;
