import { useRouter } from 'expo-router';
import React from 'react';

import { type AuthResponse, useUserSignUp } from '@/api/auth';
import {
  SignUpForm,
  type SignUpFormProps,
} from '@/components/auth/signup-form';
import { FocusAwareStatusBar, showErrorMessage } from '@/components/ui';
import { useAuth } from '@/lib';

export default function SignUp() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const { mutate: signUpMutation, isPending: signUpPending } = useUserSignUp();

  const onSubmit: SignUpFormProps['onSubmit'] = (data) => {
    signUpMutation(data, {
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
    });
  };
  return (
    <>
      <FocusAwareStatusBar />
      <SignUpForm onSubmit={onSubmit} isLoading={signUpPending} />
    </>
  );
}
