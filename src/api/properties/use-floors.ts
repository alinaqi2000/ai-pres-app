import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';

import { getToken } from '@/lib/auth/utils';
import { type Floor } from '@/models';

import { client } from '../common';
import { type ErrorResponse } from '../common/types';

type FloorsResponse = Floor[];
type FloorsVariables = {
  propertyId: number;
};

export const useFloors = createQuery<
  FloorsResponse,
  FloorsVariables,
  AxiosError
>({
  queryKey: ['floors'],
  fetcher: async ({ propertyId }) => {
    return client
      .get(`properties/${propertyId}/floors`, {
        headers: { Authorization: `Bearer ${getToken()?.access_token}` },
      })
      .then((response) => response.data.data);
  },
});

type AddFloorVariables = {
  propertyId: number;
  floor: {
    number: number;
  };
};

type Response = Floor;

export const useAddFloor = createMutation<
  Response,
  AddFloorVariables,
  AxiosError<ErrorResponse>
>({
  mutationFn: async (variables) =>
    client({
      url: `properties/${variables.propertyId}/floors`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()?.access_token}`,
      },
      data: variables.floor,
    }).then((response) => response.data.data),
});

export const useDeleteFloor = createMutation<
  void,
  { propertyId: number; floorId: number },
  AxiosError<ErrorResponse>
>({
  mutationFn: async (variables) =>
    client({
      url: `properties/${variables.propertyId}/floors/${variables.floorId}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()?.access_token}`,
      },
    }).then((response) => response.data),
});
