import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import * as React from 'react';

import { handleError } from '@/api';
import { type ErrorResponse } from '@/api/common/types';
import { useAddProperty, useUpdateProperty } from '@/api/properties';
import {
  PropertyForm,
  type PropertyFormType,
} from '@/components/forms/property-form';
import HeadBar from '@/components/head-bar';
import { showSuccessMessage, View } from '@/components/ui';
import {
  setEditImages,
  setEditProperty,
  setEditThumbnail,
  usePropertyStore,
} from '@/lib/store/my-properties';
import { type Property } from '@/models';

// eslint-disable-next-line max-lines-per-function
export default function CreateProperty() {
  const router = useRouter();
  const { mutate: addProperty, isPending: isAddPending } = useAddProperty();
  const { mutate: updateProperty, isPending: isUpdatePending } =
    useUpdateProperty();
  const isPending = isAddPending || isUpdatePending;
  const editProperty = usePropertyStore.use.editProperty();

  const onSaveSubmit = (data: PropertyFormType, moveNext?: boolean) => {
    if (editProperty) {
      return updateProperty(
        {
          id: editProperty.id,
          variables: {
            ...data,
            is_published: editProperty.is_published,
            is_occupied: editProperty.is_occupied,
          },
        },
        {
          onSuccess: (property: Property) => {
            showSuccessMessage('Property updated successfully');
            setEditProperty(property);
            setEditImages(property.images);
            setEditThumbnail(property.thumbnail);
            if (moveNext) {
              router.push('/properties/manage/upload-property-image');
            } else {
              router.back();
            }
          },
          onError: (error: AxiosError<ErrorResponse>) =>
            handleError(error, router),
        }
      );
    }
    addProperty(
      { ...data, is_published: false, is_occupied: false },
      {
        onSuccess: (property: Property) => {
          showSuccessMessage('Property created successfully');
          setEditProperty(property);
          setEditImages(property.images);
          setEditThumbnail(property.thumbnail);
          if (moveNext) {
            router.push('/properties/manage/upload-property-image');
          } else {
            router.back();
          }
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          handleError(error, router),
      }
    );
  };

  React.useEffect(() => {
    return () => {
      // setEditProperty(null);
      // setEditImages([]);
      // setEditThumbnail(null);
    };
  }, []);

  return (
    <View className="flex-1 gap-6">
      <HeadBar title={editProperty ? 'Edit Property' : 'Create Property'} />
      <View className="flex-1 px-4">
        <PropertyForm
          onSaveSubmit={onSaveSubmit}
          isLoading={isPending}
          defaultValues={{
            name: 'asdsad',
            city: 'Lahore',
            property_type: 'building',
            address: '123 Main St',
            description: 'A beautiful property',
            total_area: 1200,
            monthly_rent: 40000,
          }}
        />
      </View>
    </View>
  );
}
