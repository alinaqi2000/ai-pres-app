import { type AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';

import { type Payment, type PaymentMethod } from '@/models/payment';

import { client } from '../common';
import { type ErrorResponse } from '../common/types';

type Variables = {
  invoice_id: number;
  amount: number;
  payment_method_id: number;
  transaction_id: string;
};

type Response = Payment;

export const useOwnerPayments = createQuery<Payment[], void, AxiosError>({
  queryKey: ['owner-payments'],
  fetcher: async () => {
    return client
      .get(`payments/owner/me`)
      .then((response) => response.data.data);
  },
});

export const useGetPayment = createQuery<
  Payment,
  { paymentId: number },
  AxiosError
>({
  queryKey: ['get-payment'],
  fetcher: async ({ paymentId }) => {
    return client
      .get(`payments/${paymentId}`)
      .then((response) => response.data.data);
  },
});

export const usePaymentMethods = createQuery<PaymentMethod[], void, AxiosError>(
  {
    queryKey: ['payment-methods'],
    fetcher: async () => {
      return client
        .get(`payment-methods/get-payment-methods`)
        .then((response) => response.data.data);
    },
  }
);

export const useAddPayment = createMutation<
  Response,
  { variables: Variables },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ variables }) =>
    client({
      url: `payments/create_payment`,
      method: 'POST',
      data: variables,
    }).then((response) => response.data.data),
});

export const useUpdatePayment = createMutation<
  Response,
  { id: number; variables: { status: string } },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ id, variables }) =>
    client({
      url: `payments/${id}`,
      method: 'PATCH',
      data: variables,
    }).then((response) => response.data.data),
});
