import * as React from 'react';
import { Alert, ScrollView } from 'react-native';
import { Chip, Icon, Text } from 'react-native-paper';

import { useGetPayment, useUpdatePayment } from '@/api/payments/use-payments';
import HeadBar from '@/components/head-bar';
import {
  Button,
  colors,
  showErrorMessage,
  showSuccessMessage,
  View,
} from '@/components/ui';
import { usePaymentStore } from '@/lib/store/payments';

export default function PaymentDetail() {
  const ownerMode = usePaymentStore.use.currentPaymentMode() === 'owner';
  const {
    data: payment,
    isLoading,
    refetch,
  } = useGetPayment({
    variables: {
      paymentId: usePaymentStore.use.currentPayment()?.id || 0,
    },
  });

  const { mutateAsync: updatePayment } = useUpdatePayment();

  const handleApprovePayment = () => {
    updatePayment(
      {
        id: payment?.id || 0,
        variables: {
          status: 'completed',
        },
      },
      {
        onSuccess: () => {
          showSuccessMessage('Payment has been approved successfully');
          refetch();
        },
        onError: () => {
          showErrorMessage('Payment has been failed to approve');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!payment) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Payment not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <HeadBar
        title={`Payment #${payment.transaction_id}`}
        right={
          payment.status === 'pending' && ownerMode ? (
            <Button
              style={{ height: 32 }}
              label="Approve"
              onPress={() =>
                Alert.alert(
                  'Approve Payment',
                  'Are you sure you want to approve this payment?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Approve',
                      onPress: handleApprovePayment,
                    },
                  ]
                )
              }
            />
          ) : null
        }
      />

      <ScrollView className="flex-1 py-6 pl-5 pr-4">
        {/* Header Section */}
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center">
              <Icon source="pound" size={16} color={colors.primary[400]} />
              <Text variant="titleMedium" className="text-gray-600">
                {payment.transaction_id}
              </Text>
            </View>
            <Text variant="bodyMedium" className="text-gray-600">
              {new Date(payment.created_at).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
                day: 'numeric',
              })}
            </Text>
          </View>
          <Chip
            style={{
              backgroundColor:
                payment.status === 'completed'
                  ? '#dcfce7'
                  : payment.status === 'pending'
                    ? '#fef9c3'
                    : payment.status === 'failed'
                      ? '#fee2e2'
                      : '#f3f4f6',
            }}
            textStyle={{
              color:
                payment.status === 'completed'
                  ? '#166534'
                  : payment.status === 'pending'
                    ? '#92400e'
                    : payment.status === 'failed'
                      ? '#991b1b'
                      : '#64748b',
              fontSize: 14,
              fontWeight: '600',
            }}
          >
            {payment.status.toUpperCase()}
          </Chip>
        </View>

        {/* Payment Details */}
        <View className="mb-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <Text variant="titleMedium" className="mb-2 font-semibold">
            Payment Details
          </Text>
          <View className="mb-4 flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Invoice
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                #INV-{payment.invoice.reference_number}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Payment Date
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {new Date(payment.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          <View className="border-t border-gray-300 pt-4">
            <Text variant="titleMedium" className="mb-2 font-semibold">
              Amount
            </Text>
            <View className="flex-row items-start justify-between">
              <Text variant="titleMedium" className="font-semibold">
                Total Amount
              </Text>
              <Text
                variant="titleMedium"
                className="font-bold text-primary-600"
              >
                Rs{payment.invoice.amount.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Tenant Details */}
        <View className="mb-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <Text variant="titleMedium" className="mb-2 font-semibold">
            Tenant Information
          </Text>
          <View className="mb-4 flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Name
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {payment.tenant?.name || 'N/A'}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Email
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {payment.tenant?.email || 'N/A'}
              </Text>
            </View>
          </View>
          <View className="flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                City
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {payment.tenant?.city || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="mb-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <Text variant="titleMedium" className="mb-2 font-semibold">
            Payment Method
          </Text>
          <View className="flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Method
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {payment.payment_method?.name || 'N/A'}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Type
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {payment.payment_method?.type || 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
