import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import * as React from 'react';

import { handleError } from '@/api';
import { type ErrorResponse } from '@/api/common/types';
import { useAddUnit, useUpdateUnit } from '@/api/units';
import { useDeleteUnitImage, useUploadUnitImage } from '@/api/units';
import { UnitForm, type UnitFormType } from '@/components/forms/unit-form';
import HeadBar from '@/components/head-bar';
import { showSuccessMessage, View } from '@/components/ui';
import { usePropertyStore } from '@/lib/store/my-properties';
import {
  setEditImages,
  setEditUnit,
  toggleRemoveLatestUpload,
  useUnitStore,
} from '@/lib/store/units';
import { type Unit } from '@/models/unit';

export default function CreateUnit() {
  const router = useRouter();
  const { mutate: addUnit, isPending: isAddPending } = useAddUnit();
  const { mutate: updateUnit, isPending: isUpdatePending } = useUpdateUnit();
  const isPending = isAddPending || isUpdatePending;

  const editUnit = useUnitStore.use.editUnit();
  const editFloor = useUnitStore.use.editFloor();
  const editProperty = usePropertyStore.use.editProperty();
  const editImages = useUnitStore.use.editImages();

  const { mutate: uploadImage } = useUploadUnitImage();
  const { mutate: deleteImage } = useDeleteUnitImage();
  const onSaveSubmit = (data: UnitFormType) => {
    if (editUnit) {
      updateUnit(
        {
          id: editUnit.id,
          property_id: editProperty?.id || 0,
          floor_id: editFloor?.id || 0,
          variables: data,
        },
        {
          onSuccess: (unit: Unit) => {
            showSuccessMessage('Unit updated successfully');
            setEditUnit(unit);
          },
          onError: (error: AxiosError<ErrorResponse>) =>
            handleError(error, router),
        }
      );
      return;
    }
    addUnit(
      {
        property_id: editProperty?.id || 0,
        floor_id: editFloor?.id || 0,
        variables: data,
      },
      {
        onSuccess: (unit: Unit) => {
          showSuccessMessage('Unit created successfully');
          setEditUnit(unit);
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          handleError(error, router),
      }
    );
  };

  const uploadImageHandler = ({ image }: { image: any }) => {
    uploadImage(
      {
        unitId: Number(editUnit?.id),
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
        onError: (error: AxiosError<ErrorResponse>) => {
          handleError(error, router);
          toggleRemoveLatestUpload();
        },
      }
    );
  };

  const deleteImageHandler = (imageId: number) => {
    deleteImage(
      {
        imageId,
      },
      {
        onSuccess: () => {
          setEditImages(editImages.filter((image) => image.id !== imageId));
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          handleError(error, router),
      }
    );
  };

  React.useEffect(() => {
    return () => {
      // setEditUnit(null);
    };
  }, []);

  return (
    <View className="flex-1 gap-6">
      <HeadBar
        title={`${editFloor?.name || ''} - ${editUnit ? 'Edit Unit' : 'Create Unit'}`}
      />
      <View className="flex-1 px-4">
        <UnitForm
          onSaveSubmit={onSaveSubmit}
          onSubmitImage={uploadImageHandler}
          onSubmitDeleteImage={deleteImageHandler}
          isLoading={isPending}
          defaultValues={{
            name: 'asd asd ',
            unit_type: 'shop',
            area: 500,
            monthly_rent: 1000,
            description: 'asd ',
            has_washroom: true,
            has_air_conditioning: true,
            has_internet: true,
          }}
        />
      </View>
    </View>
  );
}
