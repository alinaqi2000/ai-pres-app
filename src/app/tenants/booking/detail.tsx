import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView } from 'react-native';
import { Chip, Dialog, Icon, Text } from 'react-native-paper';

import { handleError } from '@/api';
import { type ErrorResponse } from '@/api/common/types';
import { useCreateTenantRequest } from '@/api/tenants';
import { useGetBooking } from '@/api/tenants/use-bookings';
import HeadBar from '@/components/head-bar';
import { colors, Input, showSuccessMessage, View } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { toTitleCase, useAuth } from '@/lib';
import { useBookingStore } from '@/lib/store/bookings';

export default function BookingDetail() {
  const { data: booking, isLoading } = useGetBooking({
    variables: {
      bookingId: useBookingStore.use.currentBooking()?.id || 0,
    },
  });
  const { mutate: createTenantRequest, isPending: isCreatePending } =
    useCreateTenantRequest();
  const router = useRouter();

  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const hideDialog = () => setVisible(false);

  const user = useAuth.use.user();
  const { colorScheme } = useColorScheme();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Booking not found</Text>
      </View>
    );
  }

  const onCancelBooking = () => {
    createTenantRequest(
      {
        variables: {
          booking_id: booking.id,
          type: 'cancellation',
          message,
        },
      },
      {
        onSuccess: () => {
          showSuccessMessage(
            'Booking cancellation request sent successfully to the owner'
          );
          setVisible(false);
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          handleError(error, router),
      }
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <HeadBar
        title={`Booking Details`}
        right={
          user?.id === booking.tenant?.id ? (
            <Button
              variant="softDestructive"
              label="Cancel Booking"
              onPress={() => setVisible(true)}
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
                {booking.id}
              </Text>
            </View>
            <Text variant="bodyMedium" className="text-gray-600">
              {new Date(booking.start_date).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
                day: 'numeric',
              })}
            </Text>
          </View>
          <Chip
            style={{
              backgroundColor:
                booking.status === 'active' ? '#dcfce7' : '#fee2e2',
            }}
            textStyle={{
              color: booking.status === 'active' ? '#166534' : '#991b1b',

              fontSize: 14,

              fontWeight: '600',
            }}
          >
            {toTitleCase(booking.status)}
          </Chip>
        </View>

        {/* Property Details */}
        <View className="mb-3 rounded-lg bg-gray-50 p-4 dark:bg-charcoal-900">
          <Text variant="titleMedium" className="mb-2 font-semibold">
            Property Details
          </Text>
          <View className="mb-4 flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Property ID
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {booking.property?.property_id || 'N/A'}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Property Name
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {booking.property?.name || 'N/A'}
              </Text>
            </View>
          </View>
          <View className="flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                City
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {booking.property?.city || 'N/A'}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Address
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {booking.property?.address || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Unit Details (if exists) */}
        {booking.unit && (
          <View className="mb-3 rounded-lg bg-gray-50 p-4 dark:bg-charcoal-900">
            <Text variant="titleMedium" className="mb-2 font-semibold">
              Unit Details
            </Text>
            <View className="flex-row items-start justify-between">
              <View>
                <Text variant="bodyMedium" className="font-medium">
                  Unit Name
                </Text>
                <Text variant="bodyMedium" className="text-gray-600">
                  {booking.unit?.name || 'N/A'}
                </Text>
              </View>
              <View>
                <Text variant="bodyMedium" className="font-medium">
                  Floor
                </Text>
                <Text variant="bodyMedium" className="text-gray-600">
                  {booking.floor?.name || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Tenant Details */}
        <View className="mb-3 rounded-lg bg-gray-50 p-4 dark:bg-charcoal-900">
          <Text variant="titleMedium" className="mb-2 font-semibold">
            Tenant Information
          </Text>
          <View className="mb-4 flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Name
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {booking.tenant?.name || 'N/A'}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Email
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {booking.tenant?.email || 'N/A'}
              </Text>
            </View>
          </View>
          <View className="flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                City
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {booking.tenant?.city || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Owner Details */}
        <View className="mb-3 rounded-lg bg-gray-50 p-4 dark:bg-charcoal-900">
          <Text variant="titleMedium" className="mb-2 font-semibold">
            Owner Information
          </Text>
          <View className="mb-4 flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Name
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {booking.owner?.name || 'N/A'}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Email
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {booking.owner?.email || 'N/A'}
              </Text>
            </View>
          </View>
          <View className="flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                City
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {booking.owner?.city || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Details */}
        <View className="mb-3 rounded-lg bg-gray-50 p-4 dark:bg-charcoal-900">
          <Text variant="titleMedium" className="mb-2 font-semibold">
            Booking Details
          </Text>
          <View className="mb-4 flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Start Date
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {new Date(booking.start_date).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                  day: 'numeric',
                })}
              </Text>
            </View>
            {booking.end_date && (
              <View>
                <Text variant="bodyMedium" className="font-medium">
                  End Date
                </Text>
                <Text variant="bodyMedium" className="text-gray-600">
                  {new Date(booking.end_date).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Monthly Rent
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                Rs{booking.total_price.toLocaleString()}
              </Text>
            </View>
          </View>
          <View className="mt-4 flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Notes
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {booking.notes || 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Dialog
        visible={visible}
        theme={{
          colors: {
            backdrop: 'rgba(0, 0, 0, 0.4)',
          },
        }}
        style={{
          backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
        }}
        onDismiss={hideDialog}
      >
        <Dialog.Title>
          <Text variant="titleMedium">Cancel Booking</Text>
        </Dialog.Title>
        <Dialog.Content className="flex-col gap-4">
          <Text variant="bodyMedium">
            Are you sure you want to cancel this booking?
          </Text>
          <Input
            multiline
            value={message}
            onChangeText={setMessage}
            numberOfLines={6}
            placeholder="Please note the reason for cancellation"
          />
          <Dialog.Actions>
            <Button variant="outline" onPress={hideDialog} label="Cancel" />
            <Button
              loading={isCreatePending}
              variant="destructive"
              onPress={onCancelBooking}
              label="Cancel Booking"
            />
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </View>
  );
}
