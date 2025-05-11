import React from 'react';
import type { ImageSourcePropType, ViewStyle } from 'react-native';
import { Image, View } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

const avatar = tv({
  slots: {
    container: 'overflow-hidden rounded-full',
    image: 'size-full',
  },

  variants: {
    size: {
      sm: {
        container: 'size-8',
      },
      md: {
        container: 'size-10',
      },
      lg: {
        container: 'size-12',
      },
      xl: {
        container: 'size-16',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

interface AvatarVariants extends VariantProps<typeof avatar> { }

interface Props {
  source?: ImageSourcePropType;
  size?: AvatarVariants['size'];
  className?: string;
  style?: ViewStyle;
}

export const Avatar = React.forwardRef<View, Props>(
  ({ source, size = 'md', className = '', style }, ref) => {
    const { container, image } = avatar({ size });

    return (
      <View ref={ref} className={`${container} ${className}`} style={style}>
        <Image source={source} className={image({ size })} resizeMode="cover" />
      </View>
    );
  }
);

Avatar.displayName = 'Avatar';
