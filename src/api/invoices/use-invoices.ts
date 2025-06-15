import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { type Invoice } from '@/models/invoice';

import { client } from '../common';

type Response = Invoice[];

export const useMyInvoices = createQuery<Response, void, AxiosError>({
  queryKey: ['my-invoices'],
  fetcher: async () => {
    return client
      .get(`invoices/my-invoices`)
      .then((response) => response.data.data);
  },
});

export const useTenantInvoices = createQuery<
  Response,
  { tenantId: number },
  AxiosError
>({
  queryKey: ['tenant-invoices'],
  fetcher: async ({ tenantId }) => {
    return client
      .get(`invoices/tenant/${tenantId}/invoices`)
      .then((response) => response.data.data);
  },
});
