import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, Select, Text, View } from '@/components/ui';

import { Logo } from '../logo';

const schema = z.object({
  name: z.string(),
  city: z.string(),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters'),
});

export type FormType = z.infer<typeof schema>;

export type SignUpFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  isLoading: boolean;
};

// eslint-disable-next-line max-lines-per-function
export const SignUpForm = ({
  onSubmit = () => { },
  isLoading,
}: SignUpFormProps) => {
  const router = useRouter();
  const { handleSubmit, control, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const [city, setCity] = useState<string | number>('');
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
          <Logo />
          <Text
            testID="form-title"
            className="pb-6 text-center text-4xl font-bold"
          >
            Sign Up
          </Text>
          <Text className="text-xl">Let’s get started! 🏠</Text>
          <Text className="mb-6 max-w-xs text-center text-gray-500">
            Create your account to start managing properties, tenants, and rent
            seamlessly.
          </Text>
        </View>

        <ControlledInput
          testID="name"
          control={control}
          name="name"
          label="Name"
        />
        <Select
          label="City"
          value={city}
          options={[
            { label: 'Karachi', value: 'karachi' },
            { label: 'Lahore', value: 'lahore' },
            { label: 'Islamabad', value: 'islamabad' },
            { label: 'Rawalpindi', value: 'rawalpindi' },
            { label: 'Faisalabad', value: 'faisalabad' },
            { label: 'Multan', value: 'multan' },
            { label: 'Peshawar', value: 'peshawar' },
            { label: 'Quetta', value: 'quetta' },
            { label: 'Sialkot', value: 'sialkot' },
            { label: 'Gujranwala', value: 'gujranwala' },
            { label: 'Bahawalpur', value: 'bahawalpur' },
            { label: 'Sargodha', value: 'sargodha' },
            { label: 'Hyderabad', value: 'hyderabad' },
            { label: 'Sukkur', value: 'sukkur' },
            { label: 'Abbottabad', value: 'abbottabad' },
            { label: 'Mardan', value: 'mardan' },
            { label: 'Rahim Yar Khan', value: 'rahim-yar-khan' },
            { label: 'Sheikhupura', value: 'sheikhupura' },
            { label: 'Gujrat', value: 'gujrat' },
            { label: 'Jhelum', value: 'jhelum' },
          ]}
          onSelect={(value) => {
            setCity(value);
            setValue('city', value as string);
          }}
        />
        <ControlledInput
          testID="email-input"
          control={control}
          name="email"
          label="Email"
        />
        <ControlledInput
          testID="password-input"
          control={control}
          name="password"
          label="Password"
          placeholder="********"
        />
        <Button
          testID="sign-up-button"
          label="Sign Up"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        />

        <View className="mt-6 flex-row items-center justify-center">
          <Text>Already have an account?</Text>
          <Button
            variant="link"
            testID="sign-in-button"
            textClassName="underline text-primary-600 dark:text-primary-600"
            onPress={() => router.push('/login')}
            label="Sign In"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
