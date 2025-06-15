import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button as RNButton } from 'react-native-paper';
import { z } from 'zod';

import { Button, ControlledInput, Select, View } from '@/components/ui';
import { CITIES } from '@/data/cities';
import { usePropertyStore } from '@/lib/store/my-properties';

const propertyTypes = [
  { label: 'Building', value: 'building' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'House', value: 'house' },
];

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  city: z.string().min(1, 'City is required'),
  monthly_rent: z.coerce.number().optional(),
  property_type: z.string().min(1, 'Property type is required'),
  address: z.string().min(1, 'Address is required'),
  description: z.string().min(1, 'Description is required'),
  total_area: z.coerce.number({
    invalid_type_error: 'Total area must be a number',
  }),
});

export type PropertyFormType = z.infer<typeof schema>;

export type PropertyFormProps = {
  onSaveSubmit: (data: PropertyFormType, moveNext?: boolean) => void;
  isLoading: boolean;
  defaultValues?: Partial<PropertyFormType>;
};

// eslint-disable-next-line max-lines-per-function
export const PropertyForm = ({
  onSaveSubmit,
  isLoading,
  defaultValues = {},
}: PropertyFormProps) => {
  const { handleSubmit, control, setValue, watch } = useForm<PropertyFormType>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const editProperty = usePropertyStore.use.editProperty();
  const router = useRouter();

  useEffect(() => {
    if (editProperty) {
      setValue('name', editProperty.name);
      setValue('city', editProperty.city);
      setValue('property_type', editProperty.property_type);
      setValue('address', editProperty.address);
      setValue('description', editProperty.description);
      setValue('total_area', editProperty.total_area);
      setValue('monthly_rent', 0);
      if (editProperty.monthly_rent) {
        setValue('monthly_rent', editProperty.monthly_rent);
      }
    }
  }, [editProperty, setValue]);

  const { colorScheme } = useColorScheme();
  return (
    <View className="flex-1 gap-2">
      <ControlledInput
        name="name"
        label="Property Public Name"
        control={control}
        testID="property-name"
      />
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Select
            label="City"
            options={CITIES}
            value={value}
            onSelect={onChange}
            error={error?.message}
            testID="property-city"
          />
        )}
      />
      <Controller
        control={control}
        name="property_type"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Select
            label="Property Type"
            options={propertyTypes}
            value={value}
            onSelect={onChange}
            error={error?.message}
            testID="property-type"
          />
        )}
      />
      <ControlledInput
        name="address"
        label="Address"
        control={control}
        testID="property-address"
      />
      <ControlledInput
        name="description"
        label="Description"
        control={control}
        multiline
        numberOfLines={4}
        testID="property-description"
      />
      <ControlledInput
        name="total_area"
        label="Total Area in sq ft (optional)"
        control={control}
        value={String(watch('total_area'))}
        keyboardType="numeric"
        testID="property-total-area"
      />
      <ControlledInput
        name="monthly_rent"
        label="Monthly Rent (optional)"
        control={control}
        value={String(watch('monthly_rent'))}
        keyboardType="numeric"
        testID="property-monthly-rent"
      />
      <Button
        label="Save & Close"
        loading={isLoading}
        onPress={handleSubmit((data) => onSaveSubmit(data, false))}
      />

      <View className="absolute inset-x-0 bottom-4 mt-4 w-full flex-row justify-between">
        {editProperty && (
          <RNButton
            disabled={isLoading}
            textColor={colorScheme === 'dark' ? '#ffffff' : '#000000'}
            mode="text"
            icon="chevron-right"
            contentStyle={{ flexDirection: 'row-reverse' }}
            onPress={() => router.push('/properties/manage/manage-floors')}
          >
            Manage Floors
          </RNButton>
        )}
        <RNButton
          disabled={isLoading}
          icon="chevron-right"
          textColor={colorScheme === 'dark' ? '#ffffff' : '#000000'}
          contentStyle={{ flexDirection: 'row-reverse' }}
          mode="text"
          onPress={() =>
            editProperty
              ? router.push('/properties/manage/upload-property-image')
              : handleSubmit((data) => onSaveSubmit(data, true))()
          }
        >
          Upload Images
        </RNButton>
      </View>
    </View>
  );
};
