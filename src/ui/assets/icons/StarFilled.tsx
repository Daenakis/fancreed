import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgStarFilled = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      fill="currentColor"
      d="m6.87 6.117-5.317.77-.095.02a.833.833 0 0 0-.366 1.403l3.851 3.75-.908 5.295-.01.092a.833.833 0 0 0 1.22.786l4.754-2.5 4.744 2.5.084.039a.834.834 0 0 0 1.126-.917l-.909-5.296 3.854-3.75.064-.07a.833.833 0 0 0-.527-1.35l-5.317-.772L10.742 1.3a.833.833 0 0 0-1.495 0z"
    />
  </Svg>
);
export default SvgStarFilled;
