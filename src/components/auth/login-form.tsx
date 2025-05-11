import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, Text, View } from '@/components/ui';

import { Logo } from '../logo';

const schema = z.object({
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

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  isLoading: boolean;
};

// eslint-disable-next-line max-lines-per-function
export const LoginForm = ({
  onSubmit = () => { },
  isLoading,
}: LoginFormProps) => {
  const router = useRouter();
  const { handleSubmit, control, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  setValue('email', 'ali@gmail.com');
  setValue('password', '12345678');
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
            Sign In
          </Text>
          <Text className="text-xl"> Welcome back! 👋</Text>
          <Text className="mb-6 max-w-xs text-center text-gray-500">
            Sign in to manage your properties, track rent, and keep everything
            organized with ease.
          </Text>
        </View>
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
          secureTextEntry={true}
        />
        <View className="flex-row justify-end">
          <Button
            variant="link"
            testID="sign-up-button"
            textClassName="underline text-primary-600 dark:text-primary-600"
            onPress={() => router.replace('/reset-password')}
            label="Forgot Password?"
          />
        </View>
        <Button
          testID="login-button"
          label="Login"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        />

        <View className="mt-6 flex-row items-center justify-center">
          <Text>Don't have an account?</Text>
          <Button
            variant="link"
            testID="sign-up-button"
            textClassName="underline text-primary-600 dark:text-primary-600"
            onPress={() => router.replace('/signup')}
            label="Sign Up"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
