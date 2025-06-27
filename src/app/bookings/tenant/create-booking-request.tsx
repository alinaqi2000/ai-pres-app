import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import * as React from 'react';

import { handleError, useCreateTenantRequest } from '@/api';
import { type ErrorResponse } from '@/api/common/types';
import { type TenantRequestSchema } from '@/api/tenants/use-requests';
import {
  BookingRequestForm,
  type BookingRequestFormType,
} from '@/components/forms/booking-request-form';
import HeadBar from '@/components/head-bar';
import { showSuccessMessage, View } from '@/components/ui';
import { useBookingStore } from '@/lib/store/bookings';

export default function CreateBookingRequest() {
  const router = useRouter();
  const { mutate: createBookingRequest, isPending: isAddPending } =
    useCreateTenantRequest();

  const isPending = isAddPending;
  const currentItem = useBookingStore.use.currentItem();

  const onSaveSubmit = (data: BookingRequestFormType) => {
    const tenantRequest: TenantRequestSchema = {
      type: 'booking',
    };

    tenantRequest.property_id = data.property_id;
    if (data.unit_id) {
      tenantRequest.unit_id = data.unit_id;
    }
    if (data.floor_id) {
      tenantRequest.floor_id = data.floor_id;
    }
    tenantRequest.message = data.message;
    tenantRequest.monthly_offer = data.monthly_offer;
    tenantRequest.start_date = data.start_date;

    if (currentItem?.type === 'property') {
      data.property_id = currentItem.item.id;
    }
    if (currentItem?.type === 'unit') {
      data.unit_id = currentItem.item.id;
    }

    createBookingRequest(
      {
        variables: {
          ...tenantRequest,
        },
      },
      {
        onSuccess: () => {
          showSuccessMessage(
            'Booking request sent successfully. The property owner will get back to you soon.',
            10000
          );
          router.back();
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          handleError(error, router),
      }
    );
  };

  return (
    <View className="flex-1 gap-6">
      <HeadBar title={`Create Booking Request`} />
      <View className="flex-1 px-4">
        <BookingRequestForm onSaveSubmit={onSaveSubmit} isLoading={isPending} />
      </View>
    </View>
  );
}
