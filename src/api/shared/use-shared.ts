import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { type Report } from '@/models/report';

import { client } from '../common';

type Response = Report;

export const useOwnerReports = createQuery<Response, void, AxiosError>({
  queryKey: ['owner-reports'],
  fetcher: async () => {
    return client.get(`reports/owner`).then((response) => response.data.data);
  },
});

export const useTenantReports = createQuery<Response, void, AxiosError>({
  queryKey: ['tenant-reports'],
  fetcher: async () => {
    return client.get(`reports/tenant`).then((response) => response.data.data);
  },
});
