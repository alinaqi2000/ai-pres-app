import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';

import { type User } from '../auth';
import { client } from '../common';
import { type ErrorResponse } from '../common/types';

type Variables = {
  name: string;
  email: string;
  password: string;
  city: string;
  phone: string;
  cnic: string;
  gender: string;
  nature_of_business: string;
};

type Response = User[];

export const useMyTenants = createQuery<Response, void, AxiosError>({
  queryKey: ['tenants'],
  fetcher: async () => {
    return client.get(`auth/my-users`).then((response) => response.data.data);
  },
});

export const useAddTenant = createMutation<
  User,
  { variables: Variables },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ variables }) =>
    client({
      url: `auth/create-user`,
      method: 'POST',
      data: variables,
    }).then((response) => response.data.data),
});

export const useUpdateTenant = createMutation<
  User,
  { id: number; variables: Variables },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ id, variables }) =>
    client({
      url: `auth/update-user/${id}`,
      method: 'PUT',
      data: variables,
    }).then((response) => response.data.data),
});

export const useDeleteTenant = createMutation<
  User,
  { id: number },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ id }) =>
    client({
      url: `auth/delete-user/${id}`,
      method: 'DELETE',
    }).then((response) => response.data.data),
});
