import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { type TenantRequest } from '@/models/tenant-request';

import { client } from '../common';
import { type ErrorResponse } from '../common/types';

type Variables = {
  is_seen?: boolean;
  status: 'active' | 'rejected' | 'accepted';
};

type Response = TenantRequest[];

export const useUpdateTenantRequest = createMutation<
  Response,
  { variables: Variables; id: number },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ variables, id }) =>
    client({
      url: `tenant_requests/update-request/${id}`,
      method: 'PATCH',
      data: variables,
    }).then((response) => response.data.data),
});
