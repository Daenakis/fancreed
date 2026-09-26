import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
const SvgShopFill = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      fill="currentColor"
      d="M5 1.667a.833.833 0 0 1 .827.735l.006.098v.89l10.893.78a.833.833 0 0 1 .774.853l-.008.095-.834 5.833a.83.83 0 0 1-.73.71l-.095.006h-10v1.666h8.334a2.5 2.5 0 1 1-2.496 2.647l-.004-.147.004-.146q.023-.36.138-.687H7.358a2.5 2.5 0 1 1-4.854.98l-.004-.147.004-.146a2.5 2.5 0 0 1 1.663-2.212V3.333h-.834a.833.833 0 0 1-.827-.735L2.5 2.5a.833.833 0 0 1 .736-.827l.097-.006zM5 15a.833.833 0 1 0 0 1.667A.833.833 0 0 0 5 15m9.167 0a.833.833 0 1 0 0 1.667.833.833 0 0 0 0-1.667"
    />
  </Svg>
);
export default SvgShopFill;
