import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';

import { type TenantRequest } from '@/models/tenant-request';

import { client } from '../common';
import { type ErrorResponse } from '../common/types';

type Variables = {
  booking_id?: number;
  floor_id?: number;
  unit_id?: number;
  message?: string;
  type: 'cancellation' | 'booking' | 'maintenance';
};

type Response = TenantRequest[];

export const useTenantCancellationRequests = createQuery<
  Response,
  void,
  AxiosError
>({
  queryKey: ['tenants-requests-cancellation'],
  fetcher: async () => {
    return client
      .get(`tenant_requests/cancellation`)
      .then((response) => response.data.data);
  },
});

export const useTenantBookingRequests = createQuery<Response, void, AxiosError>(
  {
    queryKey: ['tenants-requests-booking'],
    fetcher: async () => {
      return client
        .get(`tenant_requests/booking`)
        .then((response) => response.data.data);
    },
  }
);

export const useCreateTenantRequest = createMutation<
  Response,
  { variables: Variables },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ variables }) =>
    client({
      url: `tenant_requests/create_request`,
      method: 'POST',
      data: variables,
    }).then((response) => response.data.data),
});
