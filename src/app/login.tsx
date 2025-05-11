import { useRouter } from 'expo-router';
import React from 'react';

import { type AuthResponse, useUserSignIn } from '@/api/auth';
import type { LoginFormProps } from '@/components/auth/login-form';
import { LoginForm } from '@/components/auth/login-form';
import { FocusAwareStatusBar, showErrorMessage } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const { mutate: signInMutation, isPending: signInPending } = useUserSignIn();

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    console.log(data);
    signInMutation(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (response: AuthResponse) => {
          signIn(
            {
              access_token: response.data.access_token,
              token_type: response.data.token_type,
            },
            response.data.user
          );
          router.push('/');
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
      <LoginForm onSubmit={onSubmit} isLoading={signInPending} />
    </>
  );
}
