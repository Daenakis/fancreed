import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgWebsite = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.25 5.833A7.5 7.5 0 0 0 10 2.5a7.49 7.49 0 0 0-6.237 3.333"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.583 2.5a14.2 14.2 0 0 0-1.521 3.333M10.417 2.5a14.2 14.2 0 0 1 1.523 3.333M16.25 14.167A7.5 7.5 0 0 1 10 17.5a7.49 7.49 0 0 1-6.237-3.333"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.583 17.5a14.2 14.2 0 0 1-1.521-3.333M10.417 17.5a14.2 14.2 0 0 0 1.523-3.333M1.667 8.333l.833 3.334 1.25-3.334L5 11.667l.833-3.334M14.167 8.333 15 11.667l1.25-3.334 1.25 3.334.833-3.334M7.917 8.333l.833 3.334L10 8.333l1.25 3.334.833-3.334"
    />
  </Svg>
);
export default SvgWebsite;
