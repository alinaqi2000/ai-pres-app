import { type Control, Controller, type FieldPath } from 'react-hook-form';

import { Button } from '@/components/ui';
import { CheckRound } from '@/components/ui/icons';

export type ToggleButtonProps<T extends Record<string, any>> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  bgColor: string;
};

export function useToggleButton<T extends Record<string, any>>({
  control,
  name,
  label,
  bgColor,
}: ToggleButtonProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Button
          icon={
            value ? (
              <CheckRound width={16} height={16} color={bgColor} />
            ) : undefined
          }
          onPress={() => onChange(!value)}
          textClassName={value ? `text-${bgColor}-800` : ''}
          className={`flex-1 rounded-full ${value ? `bg-${bgColor}-100 dark:bg-${bgColor}-200` : ''}`}
          label={label}
        />
      )}
    />
  );
}

export const ToggleButton = ({
  control,
  name,
  label,
  bgColor,
}: ToggleButtonProps<any>) => {
  return useToggleButton({
    control,
    name,
    label,
    bgColor,
  });
};
