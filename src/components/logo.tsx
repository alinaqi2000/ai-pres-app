/* eslint-disable max-lines-per-function */
import * as React from 'react';

import { useThemeConfig } from '@/lib/use-theme-config';

import { Image, type ImgProps } from './ui';

export const Logo = (props: ImgProps) => {
  const theme = useThemeConfig();
  const [logoSource, setLogoSource] = React.useState<any>(null);

  React.useEffect(() => {
    const source = theme.dark
      ? require('@/../assets/icon.png')
      : require('@/../assets/icon-light.png');
    setLogoSource(source);
  }, [theme.dark]);

  if (!logoSource) {
    return null;
  }

  return (
    <Image
      source={logoSource}
      className={`mb-6 size-36 overflow-hidden ${props.className || ''}`}
      contentFit="cover"
      {...props}
    />
  );
};
