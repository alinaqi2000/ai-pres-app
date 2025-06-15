import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import * as React from 'react';

import { handleError } from '@/api';
import { type ErrorResponse } from '@/api/common/types';
import { useAddPayment, usePaymentMethods } from '@/api/payments/use-payments';
import {
  PaymentForm,
  type PaymentFormType,
} from '@/components/forms/payment-form';
import HeadBar from '@/components/head-bar';
import { showSuccessMessage, View } from '@/components/ui';
import { type Payment } from '@/models/payment';

// eslint-disable-next-line max-lines-per-function
export default function CreatePayment() {
  const router = useRouter();
  const { mutate: addPayment, isPending } = useAddPayment();
  const { data: paymentMethods } = usePaymentMethods();

  const onSaveSubmit = (data: PaymentFormType) => {
    addPayment(
      {
        variables: data,
      },
      {
        // eslint-disable-next-line unused-imports/no-unused-vars
        onSuccess: (payment: Payment) => {
          showSuccessMessage(
            'Payment added successfully. The owner will be notified. The status will be changed to Paid after payment confirmation.'
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
      <HeadBar title="Add Payment" />
      <View className="flex-1 px-4">
        <PaymentForm
          onSaveSubmit={onSaveSubmit}
          isLoading={isPending}
          paymentMethods={paymentMethods || []}
        />
      </View>
    </View>
  );
}
