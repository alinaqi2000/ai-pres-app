import { useRouter } from 'expo-router';
import React from 'react';

import { useForgotPassword } from '@/api/auth';
import type { ResetPasswordFormProps } from '@/components/auth/reset-password-form';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import {
  FocusAwareStatusBar,
  showErrorMessage,
  showSuccessMessage,
} from '@/components/ui';

export default function ForgotPassword() {
  const router = useRouter();
  const { mutate: forgotPasswordMutation, isPending: forgotPasswordPending } =
    useForgotPassword();

  const onSubmit: ResetPasswordFormProps['onSubmit'] = (data) => {
    forgotPasswordMutation(
      {
        email: data.email,
      },
      {
        onSuccess: () => {
          showSuccessMessage('Password reset email sent successfully');
          router.push('/login');
        },
        onError: (error) => {
          showErrorMessage(error?.response?.data?.message);
        },
      }
    );
  };
  return (
    <>
      <FocusAwareStatusBar />
      <ResetPasswordForm
        onSubmit={onSubmit}
        isLoading={forgotPasswordPending}
      />
    </>
  );
}
