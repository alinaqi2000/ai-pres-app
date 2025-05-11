import React from 'react';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

const card = tv({
  slots: {
    container: 'rounded-lg bg-white shadow-sm',
  },

  variants: {
    variant: {
      default: {
        container: 'bg-white dark:bg-neutral-900',
      },
      outline: {
        container: 'border border-neutral-200 dark:border-neutral-800',
      },
    },
  },

defaultVariants: {
  variant: 'default',
},
});

interface CardVariants extends VariantProps<typeof card> {}

interface Props {
  children: React.ReactNode;
  variant?: CardVariants['variant'];
  className?: string;
  style?: ViewStyle;
}

export const Card = React.forwardRef<View, Props>(
  ({ children, variant = 'default', className = '', style }, ref) => {
    const { container } = card({ variant });

    return (
      <View
        ref={ref}
        className={`${container} ${className}`}
        style={style}
      >
        {children}
      </View>
    );
  },
);

Card.displayName = 'Card';
