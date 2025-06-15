import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import * as React from 'react';

import { handleError } from '@/api';
import { type User } from '@/api/auth';
import { type ErrorResponse } from '@/api/common/types';
import { useCreateBooking } from '@/api/tenants/use-bookings';
import {
  BookingForm,
  type BookingFormType,
} from '@/components/forms/booking-form';
import HeadBar from '@/components/head-bar';
import { showSuccessMessage, View } from '@/components/ui';
import { useBookingStore } from '@/lib/store/bookings';
import { setEditTenant } from '@/lib/store/tenants';

export default function CreateBooking() {
  const router = useRouter();
  const { mutate: createBooking, isPending: isAddPending } = useCreateBooking();

  const isPending = isAddPending;
  const currentTenant = useBookingStore.use.currentTenant();
  const currentItem = useBookingStore.use.currentItem();

  const onSaveSubmit = (data: BookingFormType) => {
    if (currentItem?.type === 'property') {
      data.property_id = currentItem.item.id;
    }
    if (currentItem?.type === 'unit') {
      data.unit_id = currentItem.item.id;
    }
    createBooking(
      {
        variables: {
          tenant_id: currentTenant?.id || 0,
          ...data,
        },
      },
      {
        onSuccess: (tenant: User) => {
          showSuccessMessage('Booking created successfully');
          setEditTenant(tenant);
          router.back();
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          handleError(error, router),
      }
    );
  };

  return (
    <View className="flex-1 gap-6">
      <HeadBar title={`Create Booking for ${currentTenant?.name}`} />
      <View className="flex-1 px-4">
        <BookingForm onSaveSubmit={onSaveSubmit} isLoading={isPending} />
      </View>
    </View>
  );
}
