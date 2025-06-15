import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import type { Image } from '@/models';

import { client } from '../common';
import { type ErrorResponse } from '../common/types';
import { type EmptyResponse } from '../types';

export type UploadPropertyThumbnailVariables = {
  propertyId: number;
  thumbnail: any; // File or FormData type
};

export type UploadPropertyImageVariables = {
  propertyId: number;
  image: any; // File or FormData type
};

export type UploadPropertyThumbnailResponse = Image;
export type UploadPropertyImageResponse = Image;
export const useUploadPropertyThumbnail = createMutation<
  UploadPropertyThumbnailResponse,
  UploadPropertyThumbnailVariables,
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ propertyId, thumbnail }) => {
    const formData = new FormData();
    formData.append('file', thumbnail);
    return client({
      url: `images/property/${propertyId}/thumbnail`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    }).then((response) => response.data.data);
  },
});

export const useUploadPropertyImage = createMutation<
  UploadPropertyImageResponse,
  UploadPropertyImageVariables,
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ propertyId, image }) => {
    const formData = new FormData();
    formData.append('file', image);
    return client({
      url: `images/property/${propertyId}/image`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    }).then((response) => response.data.data);
  },
});

export const useDeletePropertyImage = createMutation<
  EmptyResponse,
  { imageId: number },
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ imageId }) => {
    return client({
      url: `images/property/image/${imageId}`,
      method: 'DELETE',
    }).then((response) => response.data.data);
  },
});
