import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from 'expo-router';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/api/common/types';

import { useChangePassword } from '@/api/auth/user-auth';
import {
  Button,
  ControlledInput,
  showErrorMessage,
  showSuccessMessage,
  View,
} from '@/components/ui';
import { useAuth } from '@/lib';
import { TokenType } from '@/lib/auth/utils';
import { useRouter } from 'expo-router';

const schema = z
  .object({
    current_password: z.string().min(8),
    new_password: z.string().min(8),
    confirm_password: z.string().min(8),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type FormType = z.infer<typeof schema>;

export default function ChangePassword() {
  const token = useAuth.use.token();
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const { mutate: changePassword, isPending } = useChangePassword();

  const onSubmit = (data: FormType) => {
    changePassword(
      {
        current_password: data.current_password,
        new_password: data.new_password,
        token: token as TokenType,
      },
      {
        onSuccess: () => {
          showSuccessMessage('Password changed successfully');
          reset();
          router.back();
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          showErrorMessage(error?.response?.data?.message);
        },
      }
    );
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Change Password',
          headerBackTitle: 'Settings',
        }}
      />
      <View className="flex-1 p-4 ">
        <ControlledInput
          name="current_password"
          label="Current Password"
          control={control}
          testID="current-password"
        />
        <ControlledInput
          name="new_password"
          label="New Password"
          control={control}
          testID="new-password-input"
        />
        <ControlledInput
          name="confirm_password"
          label="Confirm Password"
          control={control}
          testID="confirm-password-input"
        />
        <Button
          label="Change Password"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
          testID="change-password-button"
        />
      </View>
    </>
  );
}
