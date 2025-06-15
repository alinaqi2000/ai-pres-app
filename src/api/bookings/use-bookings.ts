import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';

import { type Booking } from '@/models/booking';
import { type Item } from '@/models/item';

import { client } from '../common';
import { type ErrorResponse } from '../common/types';

type Variables = {
  tenantId: number;
  name: string;
  email: string;
  password: string;
  city: string;
  phone: string;
  cnic: string;
  gender: string;
  nature_of_business: string;
};

type Response = Booking[];
type ItemResponse = Item[];

export const useMyBookings = createQuery<Response, void, AxiosError>({
  queryKey: ['my-bookings'],
  fetcher: async () => {
    return client
      .get(`bookings/my-bookings`)
      .then((response) => response.data.data);
  },
});

export const useAvailablePropertiesAndUnits = createQuery<
  ItemResponse,
  void,
  AxiosError
>({
  queryKey: ['available-properties-and-units'],
  fetcher: async () => {
    return client
      .get(`properties/properties-and-units/available`)
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

export const useAddBooking = createMutation<
  Booking,
  { variables: Variables },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ variables }) =>
    client({
      url: `bookings/tenant-bookings`,
      method: 'POST',
      data: variables,
    }).then((response) => response.data.data),
});
