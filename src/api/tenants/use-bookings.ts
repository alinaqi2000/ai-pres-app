import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';

import { type Booking } from '@/models/booking';

import { type User } from '../auth';
import { client } from '../common';
import { type ErrorResponse } from '../common/types';

type Variables = {
  property_id?: number;
  unit_id?: number;
  tenant_id: number;
  start_date: string;
  end_date?: string;
  total_price: number;
  notes?: string;
};

type Response = Booking[];

export const useTenantBookings = createQuery<
  Response,
  { tenantId: number },
  AxiosError
>({
  queryKey: ['tenants-bookings'],
  fetcher: async ({ tenantId }) => {
    return client
      .get(`bookings/tenant-bookings/${tenantId}`)
      .then((response) => response.data.data);
  },
});

export const useCreateBooking = createMutation<
  User,
  { variables: Variables },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ variables }) =>
    client({
      url: `bookings/create-booking`,
      method: 'POST',
      data: variables,
    }).then((response) => response.data.data),
});

export const useGetBooking = createQuery<
  Booking,
  { bookingId: number },
  AxiosError
>({
  queryKey: ['booking'],
  fetcher: async ({ bookingId }) => {
    return client
      .get(`bookings/${bookingId}`)
      .then((response) => response.data.data);
  },
});
