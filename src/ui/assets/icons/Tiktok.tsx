import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgTiktok = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.5 6.598v3.361a8.3 8.3 0 0 1-4.167-1.626v3.75a5.417 5.417 0 1 1-6.666-5.271v3.605A2.083 2.083 0 1 0 10 12.083V2.5h3.403A5 5 0 0 0 17.5 6.598"
    />
  </Svg>
);
export default SvgTiktok;
