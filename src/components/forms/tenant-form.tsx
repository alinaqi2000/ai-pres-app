import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { type Gender } from '@/api/auth';
import { Button, ControlledInput, Select, View } from '@/components/ui';
import { CITIES } from '@/data/cities';
import { useTenantStore } from '@/lib/store/tenants';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  city: z.string().min(1, 'City is required'),
  phone: z.string().min(1, 'Phone is required'),
  cnic: z.string().min(1, 'CNIC is required'),
  gender: z.enum(['Male', 'Female']),
  nature_of_business: z.string().min(1, 'Nature of business is required'),
});

export type TenantFormType = z.infer<typeof schema>;

export type TenantFormProps = {
  onSaveSubmit: (data: TenantFormType, moveNext?: boolean) => void;
  isLoading: boolean;
  defaultValues?: Partial<TenantFormType>;
};

export const TenantForm = ({
  onSaveSubmit,
  isLoading,
  defaultValues = {},
}: TenantFormProps) => {
  const { handleSubmit, control, setValue } = useForm<TenantFormType>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const editTenant = useTenantStore.use.editTenant();

  const [city, setCity] = useState<string | number>('');

  useEffect(() => {
    if (editTenant) {
      setValue('name', editTenant.name);
      setValue('city', editTenant.city);
      setCity(editTenant.city);
      setValue('email', editTenant.email);
      setValue('gender', (editTenant.gender as Gender) || 'Male');
      setValue('nature_of_business', editTenant.nature_of_business || '');
      setValue('phone', editTenant.phone || '');
      setValue('cnic', editTenant.cnic || '');
    } else {
      setCity(defaultValues.city || '');
    }
  }, [editTenant, setValue, defaultValues.city]);

  return (
    <View className="flex-1 gap-2">
      <ControlledInput
        name="name"
        label="Name"
        control={control}
        testID="tenant-name"
      />
      <ControlledInput
        name="email"
        label="Email"
        control={control}
        testID="tenant-email"
      />
      <Select
        label="City"
        value={city}
        options={CITIES}
        onSelect={(value) => {
          setCity(value);
          setValue('city', value as string);
        }}
      />
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Select
            label="Gender"
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
            ]}
            value={value}
            onSelect={onChange}
            error={error?.message}
            testID="tenant-gender"
          />
        )}
      />
      <ControlledInput
        name="phone"
        label="Phone"
        control={control}
        testID="tenant-phone"
      />
      <ControlledInput
        name="cnic"
        label="CNIC"
        control={control}
        testID="tenant-cnic"
      />
      <ControlledInput
        name="nature_of_business"
        label="Nature of Business"
        control={control}
        testID="tenant-nature-of-business"
      />
      <Button
        label="Save & Close"
        loading={isLoading}
        onPress={handleSubmit((data) => onSaveSubmit(data, false))}
      />
    </View>
  );
};
