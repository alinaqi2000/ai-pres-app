import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Alert } from 'react-native';

import { handleError } from '@/api';
import { type User } from '@/api/auth';
import { type ErrorResponse } from '@/api/common/types';
import { useAddTenant, useDeleteTenant, useUpdateTenant } from '@/api/tenants';
import {
  TenantForm,
  type TenantFormType,
} from '@/components/forms/tenant-form';
import HeadBar from '@/components/head-bar';
import { Button, showSuccessMessage, View } from '@/components/ui';
import { Trash } from '@/components/ui/icons';
import {
  setEditTenant,
  toggleRemovedTenant,
  useTenantStore,
} from '@/lib/store/tenants';

// eslint-disable-next-line max-lines-per-function
export default function CreateProperty() {
  const router = useRouter();
  const { mutate: addTenant, isPending: isAddPending } = useAddTenant();
  const { mutate: deleteTenant, isPending: isDeletePending } =
    useDeleteTenant();
  const { mutate: updateTenant, isPending: isUpdatePending } =
    useUpdateTenant();
  const isPending = isAddPending || isUpdatePending;
  const editTenant = useTenantStore.use.editTenant();

  const onSaveSubmit = (data: TenantFormType, moveNext?: boolean) => {
    if (editTenant) {
      updateTenant(
        {
          id: editTenant.id,
          variables: data,
        },
        {
          onSuccess: (tenant: User) => {
            showSuccessMessage('Tenant updated successfully');
            setEditTenant(tenant);
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
      return;
    }
    addTenant(
      {
        variables: data,
      },
      {
        onSuccess: (tenant: User) => {
          showSuccessMessage('Tenant created successfully');
          setEditTenant(tenant);
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          handleError(error, router),
      }
    );
  };

  const onDeleteTenant = () => {
    if (editTenant) {
      Alert.alert(
        'Delete Tenant',
        'Are you sure you want to delete this tenant?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              deleteTenant(
                {
                  id: editTenant.id,
                },
                {
                  onSuccess: () => {
                    showSuccessMessage('Tenant deleted successfully');
                    toggleRemovedTenant();
                    router.back();
                  },
                  onError: (error: AxiosError<ErrorResponse>) =>
                    handleError(error, router),
                }
              );
            },
          },
        ]
      );
    }
  };

  return (
    <View className="flex-1 gap-6">
      <HeadBar
        title={editTenant ? 'Edit Tenant' : 'Create Tenant'}
        right={
          editTenant && (
            <Button
              label=""
              variant="destructive"
              icon={<Trash />}
              onPress={onDeleteTenant}
              loading={isDeletePending}
            />
          )
        }
      />
      <View className="flex-1 px-4">
        <TenantForm
          onSaveSubmit={onSaveSubmit}
          isLoading={isPending}
          defaultValues={{
            name: 'John Doe',
            city: 'Lahore',
            email: `john${Math.round(Math.random() * 100)}@gmail.com`,
            password: '12345678',
            phone: '123456789',
            cnic: '123456789',
            gender: 'Male',
            nature_of_business: 'asdsad',
          }}
        />
      </View>
    </View>
  );
}
