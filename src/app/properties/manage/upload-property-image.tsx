import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Button } from 'react-native-paper';

import { handleError } from '@/api';
import { type ErrorResponse } from '@/api/common/types';
import {
  useDeletePropertyImage,
  useUploadPropertyImage,
  useUploadPropertyThumbnail,
} from '@/api/properties';
import { PropertyImageForm } from '@/components/forms/property-image-form';
import HeadBar from '@/components/head-bar';
import { View } from '@/components/ui';
import {
  setEditImages,
  setEditThumbnail,
  usePropertyStore,
} from '@/lib/store/my-properties';

// eslint-disable-next-line max-lines-per-function
export default function UploadPropertyImages() {
  const router = useRouter();
  const editProperty = usePropertyStore.use.editProperty();
  const editImages = usePropertyStore.use.editImages();
  const { mutate: uploadThumbnail } = useUploadPropertyThumbnail();
  const { mutate: uploadImage } = useUploadPropertyImage();
  const { mutate: deleteImage } = useDeletePropertyImage();
  const { colorScheme } = useColorScheme();

  const uploadThumbnailHandler = ({ thumbnail }: { thumbnail: any }) => {
    uploadThumbnail(
      {
        propertyId: Number(editProperty?.id),
        thumbnail: {
          uri: thumbnail.uri,
          name: 'thumbnail.jpg',
          type: 'image/jpeg',
        },
      },
      {
        onSuccess: (data) => {
          setEditThumbnail(data);
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          handleError(error, router),
      }
    );
  };

  const uploadImageHandler = ({ image }: { image: any }) => {
    uploadImage(
      {
        propertyId: Number(editProperty?.id),
        image: {
          uri: image.uri,
          name: 'image.jpg',
          type: 'image/jpeg',
        },
      },
      {
        onSuccess: (data) => {
          setEditImages([...editImages, data]);
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          handleError(error, router),
      }
    );
  };

  const deleteImageHandler = (imageId: number, isThumbnail = false) => {
    deleteImage(
      {
        imageId,
      },
      {
        onSuccess: () => {
          if (isThumbnail) {
            setEditThumbnail(null);
          } else {
            setEditImages(editImages.filter((image) => image.id !== imageId));
          }
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          handleError(error, router),
      }
    );
  };

  return (
    <View className="flex-1 gap-6">
      <HeadBar title="Upload Property Images" />
      <View className="px-4">
        <PropertyImageForm
          onSubmitThumbnail={uploadThumbnailHandler}
          onSubmitImage={uploadImageHandler}
          onSubmitDeleteImage={deleteImageHandler}
        />
      </View>
      <View className="absolute bottom-4 right-4 mt-4 flex-row justify-end">
        <Button
          icon="chevron-right"
          textColor={colorScheme === 'dark' ? '#ffffff' : '#000000'}
          mode="text"
          contentStyle={{ flexDirection: 'row-reverse' }}
          onPress={() => router.push('/properties/manage/manage-floors')}
        >
          Manage Floors
        </Button>
      </View>
    </View>
  );
}
