import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgHomeFill = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      fill="currentColor"
      d="m10.59 1.91 7.5 7.5a.833.833 0 0 1-.59 1.423h-.833v5a2.5 2.5 0 0 1-2.5 2.5h-.834V12.5a2.5 2.5 0 0 0-2.353-2.496L10.833 10H9.167a2.5 2.5 0 0 0-2.5 2.5v5.833h-.834a2.5 2.5 0 0 1-2.5-2.5v-5H2.5c-.742 0-1.114-.897-.59-1.422l7.5-7.5a.833.833 0 0 1 1.18 0m.243 9.757a.833.833 0 0 1 .834.833v5.833H8.333V12.5a.833.833 0 0 1 .736-.828l.098-.005z"
    />
  </Svg>
);
export default SvgHomeFill;
