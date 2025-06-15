import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';

import { type Property } from '@/models';

import { client } from '../common';
import { type ErrorResponse } from '../common/types';

type Response = Property[];

export const useMyProperties = createQuery<Response, void, AxiosError>({
  queryKey: ['properties'],
  fetcher: async () => {
    return client.get(`properties/me`).then((response) => response.data.data);
  },
});

type Variables = {
  name: string;
  city: string;
  property_type: string;
  address: string;
  description: string;
  total_area: number;
  is_published: boolean;
  is_occupied: boolean;
};

export const useAddProperty = createMutation<
  Property,
  Variables,
  AxiosError<ErrorResponse>
>({
  mutationFn: async (variables) =>
    client({
      url: 'properties',
      method: 'POST',
      data: variables,
    }).then((response) => response.data.data),
});

export const useUpdateProperty = createMutation<
  Property,
  { id: number; variables: Variables },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ id, variables }) =>
    client({
      url: `properties/${id}`,
      method: 'PUT',
      data: variables,
    }).then((response) => response.data.data),
});

export const useDeleteProperty = createMutation<
  Property,
  { id: number },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ id }) =>
    client({
      url: `properties/${id}`,
      method: 'DELETE',
    }).then((response) => response.data.data),
});
export const useUpdatePropertyStatus = createMutation<
  Property,
  { id: number; is_published: boolean },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ id, is_published }) =>
    client({
      params: {
        is_published,
      },
      url: `properties/${id}/publish`,
      method: 'PATCH',
    }).then((response) => response.data.data),
});

export const useExploreProperties = createQuery<
  Response,
  { city: string; monthly_rent_gt: number; monthly_rent_lt: number },
  AxiosError<ErrorResponse>
>({
  queryKey: ['explore-properties'],
  fetcher: async ({ city, monthly_rent_gt, monthly_rent_lt }) => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (monthly_rent_gt)
      params.append('monthly_rent_gt', monthly_rent_gt.toString());
    if (monthly_rent_lt)
      params.append('monthly_rent_lt', monthly_rent_lt.toString());

    return client
      .get(`properties/search`, {
        params,
      })
      .then((response) => response.data.data);
  },
});
