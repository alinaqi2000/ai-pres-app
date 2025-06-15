import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { handleError } from '@/api';
import { type ErrorResponse } from '@/api/common/types';
import { useAddFloor, useDeleteFloor, useFloors } from '@/api/properties';
import { ManageFloorsForm } from '@/components/forms/manage-floors-form';
import HeadBar from '@/components/head-bar';
import { showSuccessMessage, View } from '@/components/ui';
import { setEditFloors, usePropertyStore } from '@/lib/store/my-properties';
import { useUnitStore } from '@/lib/store/units';
// eslint-disable-next-line max-lines-per-function
export default function ManageFloors() {
  const router = useRouter();
  const editProperty = usePropertyStore.use.editProperty();
  const editFloors = usePropertyStore.use.editFloors();
  const editUnit = useUnitStore.use.editUnit();
  // const { colorScheme } = useColorScheme();
  const { mutate: addFloor, isPending } = useAddFloor();
  const { mutate: deleteFloor } = useDeleteFloor();

  const { data: floors, refetch } = useFloors({
    variables: { propertyId: editProperty?.id || 0 },
  });

  useEffect(() => {
    setEditFloors(floors || []);
  }, [floors]);

  useEffect(() => {
    refetch();
  }, [editUnit, refetch]);

  const uploadFloorHandler = ({ floor }: { floor: any }) => {
    addFloor(
      {
        propertyId: Number(editProperty?.id),
        floor,
      },
      {
        onSuccess: (data) => {
          showSuccessMessage(`${data.name} added successfully`);
          setEditFloors([...editFloors, data]);
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          handleError(error, router),
      }
    );
  };

  const deleteFloorHandler = (floorId: number) => {
    deleteFloor(
      {
        propertyId: Number(editProperty?.id),
        floorId,
      },
      {
        onSuccess: () => {
          setEditFloors(editFloors.filter((floor) => floor.id !== floorId));
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          handleError(error, router),
      }
    );
  };

  return (
    <View className="flex-1 gap-6">
      <HeadBar title="Manage Floors" />
      <View className="px-4">
        <ManageFloorsForm
          onSubmitFloor={uploadFloorHandler}
          onFloorDelete={(data) => deleteFloorHandler(data.floorId)}
          isLoading={isPending}
        />
      </View>
    </View>
  );
}
