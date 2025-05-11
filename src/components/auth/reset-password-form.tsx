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
});

export type FormType = z.infer<typeof schema>;

export type ResetPasswordFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  isLoading: boolean;
};

// eslint-disable-next-line max-lines-per-function
export const ResetPasswordForm = ({
  onSubmit = () => { },
  isLoading,
}: ResetPasswordFormProps) => {
  const router = useRouter();
  const { handleSubmit, control, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  setValue('email', 'ali@gmail.com');
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
            Reset Password
          </Text>
          <Text className="text-xl"> Don't worry!</Text>
          <Text className="mb-6 max-w-xs text-center text-gray-500">
            You can reset your password here. We will send you an email to reset
            your password.
          </Text>
        </View>
        <ControlledInput
          testID="email-input"
          control={control}
          name="email"
        />
        <Button
          testID="reset-password-button"
          label="Send reset password email"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        />

        <View className="mt-6 flex-row items-center justify-center">
          <Button
            variant="link"
            testID="back-to-login-button"
            textClassName="underline text-primary-600 dark:text-primary-600"
            onPress={() => router.replace('/login')}
            label="Back to Login"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
