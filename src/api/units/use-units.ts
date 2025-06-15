import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';

import { type Image } from '@/models';
import { type Unit } from '@/models/unit';

import { client } from '../common';
import { type ErrorResponse } from '../common/types';
import { type EmptyResponse } from '../types';

type Variables = {
  name: string;
  unit_type: string;
  area: number;
  monthly_rent: number;
  description?: string;
  has_washroom: boolean;
  has_air_conditioning: boolean;
  has_internet: boolean;
  is_occupied: boolean;
};

type Response = Unit[];

export const useMyUnits = createQuery<
  Response,
  { property_id: number; floor_id: number },
  AxiosError
>({
  queryKey: ['units'],
  fetcher: async ({ property_id, floor_id }) => {
    return client
      .get(`properties/${property_id}/floors/${floor_id}/units`)
      .then((response) => response.data.data);
  },
});

export const useAddUnit = createMutation<
  Unit,
  { property_id: number; floor_id: number; variables: Variables },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ property_id, floor_id, variables }) =>
    client({
      url: `properties/${property_id}/floors/${floor_id}/units`,
      method: 'POST',
      data: variables,
    }).then((response) => response.data.data),
});

export const useUpdateUnit = createMutation<
  Unit,
  { id: number; property_id: number; floor_id: number; variables: Variables },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ id, property_id, floor_id, variables }) =>
    client({
      url: `properties/${property_id}/floors/${floor_id}/units/${id}`,
      method: 'PUT',
      data: variables,
    }).then((response) => response.data.data),
});

export const useDeleteUnit = createMutation<
  EmptyResponse,
  { property_id: number; floor_id: number; unitId: number },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ property_id, floor_id, unitId }) => {
    return client({
      url: `properties/${property_id}/floors/${floor_id}/units/${unitId}`,
      method: 'DELETE',
    }).then((response) => response.data.data);
  },
});

export type UploadUnitImageVariables = {
  unitId: number;
  image: any; // File or FormData type
};

export type UploadUnitImageResponse = Image;

export const useUploadUnitImage = createMutation<
  UploadUnitImageResponse,
  UploadUnitImageVariables,
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ unitId, image }) => {
    const formData = new FormData();
    formData.append('file', image);
    return client({
      url: `images/unit/${unitId}/image`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    }).then((response) => response.data.data);
  },
});

export const useDeleteUnitImage = createMutation<
  EmptyResponse,
  { imageId: number },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ imageId }) => {
    return client({
      url: `images/unit/image/${imageId}`,
      method: 'DELETE',
    }).then((response) => response.data.data);
  },
});
