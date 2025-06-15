import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Circle, Path } from 'react-native-svg';

export function CheckRound({ color = '#000', ...props }: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle
        opacity="0.5"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="1.5"
      />
      <Circle
        opacity="0.5"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="1.5"
      />
      <Path
        d="M8.5 12.5L10.5 14.5L15.5 9.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
