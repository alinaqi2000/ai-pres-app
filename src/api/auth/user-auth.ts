import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { type TokenType } from '@/lib/auth/utils';

import { client } from '../common';
import { type ErrorResponse } from '../common/types';
import type { AuthResponse, User } from './types';

type SignInVariables = { email: string; password: string };
type SignUpVariables = {
  email: string;
  password: string;
  name: string;
  city: string;
};

export const useUserSignIn = createMutation<
  AuthResponse,
  SignInVariables,
  AxiosError<ErrorResponse>
>({
  mutationFn: async (variables) =>
    client({
      url: 'auth/signin',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});

export const useUserSignUp = createMutation<
  AuthResponse,
  SignUpVariables,
  AxiosError<ErrorResponse>
>({
  mutationFn: async (variables) =>
    client({
      url: 'auth/signup',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});

export const useForgotPassword = createMutation<
  AuthResponse,
  { email: string },
  AxiosError<ErrorResponse>,
  { token: TokenType }
>({
  mutationFn: async (variables) =>
    client({
      url: `auth/reset-password?email=${variables.email}`,
      method: 'POST',
    }).then((response) => response.data),
});

export const useChangePassword = createMutation<
  AuthResponse,
  { current_password: string; new_password: string; token: TokenType },
  AxiosError<ErrorResponse>
>({
  mutationFn: async (variables) =>
    client({
      url: 'auth/password',
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${variables.token?.access_token}`,
      },
      data: {
        current_password: variables.current_password,
        new_password: variables.new_password,
      },
    }).then((response) => response.data),
});

export const useGetUser = createMutation<
  { data: User },
  void,
  AxiosError<ErrorResponse>
>({
  mutationFn: async () =>
    client({
      url: 'auth/me',
      method: 'GET',
    }).then((response) => response.data),
});
