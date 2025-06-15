import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Polygon } from 'react-native-svg';

export const ArrowBack = ({ fill = '#000000', ...props }: SvgProps) => (
  <Svg width="42" height="42" viewBox="0 0 42 42" {...props}>
    <Polygon
      points="31,38.32 13.391,21 31,3.68 28.279,1 8,21.01 28.279,41"
      fill={fill}
      fillRule="evenodd"
    />
  </Svg>
);
