import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { type SvgProps } from 'react-native-svg';

export function Dashboard({ ...props }: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 64 64" fill="none" {...props}>
      <Path
        d="M57 15.008H53.061V45.992a1 1 0 01-1 1h-40a1 1 0 01-1-1V15.008H7v34H57Z"
        fill="#f2f2fc"
      />
      <Path
        d="M37 51.008v3a1 1 0 01-1 1H28a1 1 0 01-1-1v-3H5.071A7.006 7.006 0 0012 57.008H52a7 7 0 006.929-6H37Z"
        fill="#61729b"
      />
      <Rect x="29" y="51.008" width="6" height="2" fill="#2c3b73" />
      <Path d="M51.061 12.706h-38V44.992h38Z" fill="#d8d8fc" />
      <Path
        d="M22.434 15.787a1 1 0 011 1V23.24h6.453a1 1 0 011 1 8.453 8.453 0 11-8.453-8.453Z"
        fill="#fdbf00"
      />
      <Path
        d="M32.123 23H24.67a1 1 0 01-1-1V14.551a1 1 0 011-1A8.457 8.457 0 0133.123 22a1 1 0 01-1 1Z"
        fill="#4bb9ec"
      />
      <Path
        d="M36.141 34.992a1 1 0 00-1 1v6a1 1 0 002 0v-6a1 1 0 00-1-1ZM40.141 32.992a1 1 0 00-1 1v8a1 1 0 002 0v-8a1 1 0 00-1-1ZM44.141 31.492a1 1 0 00-1 1v9.5a1 1 0 002 0v-9.5a1 1 0 00-1-1ZM48.122 28.992a1 1 0 00-1 1v12a1 1 0 002 0v-12a1 1 0 00-1-1Z"
        fill="#2c3b73"
      />
      <Path
        d="M49.247 16.421H34.918a1 1 0 000 2h14.329a1 1 0 000-2ZM49.247 19.278H34.918a1 1 0 000 2h14.329a1 1 0 000-2ZM49.247 22.135H34.918a1 1 0 000 2h14.329a1 1 0 000-2ZM49.247 24.992H34.918a1 1 0 000 2h14.329a1 1 0 000-2Z"
        fill="#2c3b73"
      />
      <Rect x="17.122" y="36.992" width="14" height="4" fill="#f03800" />
      <Path
        d="M32.122 34.992h-16a1 1 0 00-1 1v6a1 1 0 001 1h16a1 1 0 001-1v-6a1 1 0 00-1-1Zm-1 6h-14v-4h14Z"
        fill="#2c3b73"
      />
    </Svg>
  );
}
