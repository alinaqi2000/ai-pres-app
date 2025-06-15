import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { type ErrorResponse } from '../common/types';

export type UploadPropertyImagesVariables = {
  propertyId: number;
  thumbnail: any; // File or FormData type
  images: any[]; // File or FormData type
};

export type UploadPropertyImagesResponse = {
  success: boolean;
  message: string;
  images: string[];
};

export const useUploadPropertyImages = createMutation<
  UploadPropertyImagesResponse,
  UploadPropertyImagesVariables,
  AxiosError<ErrorResponse>
>({
  mutationFn: async ({ propertyId, thumbnail, images }) => {
    const formData = new FormData();
    formData.append('thumbnail', thumbnail);
    images.forEach((img) => {
      formData.append('file', img);
    });
    return client({
      url: `properties/${propertyId}/images`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    }).then((response) => response.data);
  },
});
