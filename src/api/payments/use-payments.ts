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

// export const useMyPayments = createQuery<Response, void, AxiosError>({
//   queryKey: ['my-payments'],
//   fetcher: async () => {
//     return client
//       .get(`invoices/my-payments`)
//       .then((response) => response.data.data);
//   },
// });

// export const useTenantInvoices = createQuery<
//   Response,
//   { tenantId: number },
//   AxiosError
// >({
//   queryKey: ['tenant-invoices'],
//   fetcher: async ({ tenantId }) => {
//     return client
//       .get(`invoices/tenant/${tenantId}/invoices`)
//       .then((response) => response.data.data);
//   },
// });

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
