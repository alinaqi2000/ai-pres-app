import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { type Booking } from '@/models/booking';

import { client } from '../common';

type Response = Booking[];

export const useOwnerBookings = createQuery<Response, void, AxiosError>({
  queryKey: ['owner-bookings'],
  fetcher: async () => {
    return client
      .get(`bookings/my-bookings`)
      .then((response) => response.data.data);
  },
});

export const useTenantBookings = createQuery<
  Response,
  { tenantId: number },
  AxiosError
>({
  queryKey: ['tenant-bookings'],
  fetcher: async ({ tenantId }) => {
    return client
      .get(`bookings/tenant-bookings/${tenantId}`)
      .then((response) => response.data.data);
  },
});
