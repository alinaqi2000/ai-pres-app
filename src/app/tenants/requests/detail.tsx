// import { useColorScheme } from 'nativewind';
import { type AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Alert, ScrollView } from 'react-native';
import { Chip, Icon, Text } from 'react-native-paper';

import { handleError } from '@/api';
import { type ErrorResponse } from '@/api/common/types';
import { useUpdateTenantRequest } from '@/api/owner';
import HeadBar from '@/components/head-bar';
import { colors, showSuccessMessage, View } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { formatCurrency, toTitleCase, useAuth } from '@/lib';
import { useTenantRequestStore } from '@/lib/store/tenant-requests';

export default function TenantRequestDetail() {
  const tenantRequest = useTenantRequestStore.use.currentTenantRequest();
  const { mutate: updateTenantRequest } = useUpdateTenantRequest();
  const router = useRouter();

  const user = useAuth.use.user();

  if (!tenantRequest) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Request not found</Text>
      </View>
    );
  }

  const handleAcceptRequest = () => {
    updateTenantRequest(
      {
        variables: {
          is_seen: true,
          status: 'accepted',
        },
        id: tenantRequest.id,
      },
      {
        onSuccess: () => {
          if (tenantRequest.type == 'booking') {
            showSuccessMessage(
              'Booking request has been accepted successfully'
            );
          } else {
            showSuccessMessage('Booking has been cancelled successfully');
          }
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          handleError(error, router),
      }
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <HeadBar
        title={`Request Details`}
        right={
          tenantRequest.status === 'pending' &&
            user?.id === tenantRequest.owner?.id ? (
            <Button
              label="Accept"
              onPress={() => {
                Alert.alert(
                  'Accept Request',
                  `Are you sure you want to accept this ${tenantRequest.type} request?`,
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Accept',
                      onPress: handleAcceptRequest,
                    },
                  ]
                );
              }}
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
                {tenantRequest.id}
                {' - '}
              </Text>
              <Text
                variant="titleMedium"
                style={{
                  color:
                    tenantRequest.type === 'cancellation'
                      ? colors.danger[600]
                      : colors.primary[600],
                }}
              >
                {toTitleCase(tenantRequest.type)}
              </Text>
            </View>
            <Text variant="bodyMedium" className="text-gray-600">
              {tenantRequest.monthly_offer ? (
                <Text variant="bodyMedium" className="text-gray-600">
                  Offered {formatCurrency(tenantRequest.monthly_offer)}
                </Text>
              ) : (
                <Text variant="bodyMedium" className="text-gray-600">
                  {new Date(tenantRequest.created_at).toLocaleDateString(
                    'en-US',
                    {
                      month: 'long',
                      year: 'numeric',
                      day: 'numeric',
                    }
                  )}
                </Text>
              )}
            </Text>
          </View>
          <Chip
            style={{
              backgroundColor:
                tenantRequest.status === 'accepted' ? '#dcfce7' : '#fee2e2',
            }}
            textStyle={{
              color:
                tenantRequest.status === 'accepted' ? '#166534' : '#991b1b',

              fontSize: 14,

              fontWeight: '600',
            }}
          >
            {toTitleCase(tenantRequest.status)}
          </Chip>
        </View>
        {tenantRequest.start_date && (
          <View className="mb-3 rounded-lg bg-gray-50 p-4 dark:bg-charcoal-900">
            <Text variant="bodyMedium" className="text-gray-600">
              Starting from{' '}
              {new Date(tenantRequest.start_date).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
                day: 'numeric',
              })}
            </Text>
          </View>
        )}
        {tenantRequest.message && (
          <View className="mb-3 rounded-lg bg-gray-50 p-4 dark:bg-charcoal-900">
            <Text variant="titleMedium">Message</Text>
            <Text variant="bodyMedium">{tenantRequest.message}</Text>
          </View>
        )}

        {/* Property Details */}
        {tenantRequest.property && (
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
                  {tenantRequest.property?.property_id || 'N/A'}
                </Text>
              </View>
              <View>
                <Text variant="bodyMedium" className="font-medium">
                  Property Name
                </Text>
                <Text variant="bodyMedium" className="text-gray-600">
                  {tenantRequest.property?.name || 'N/A'}
                </Text>
              </View>
            </View>
            <View className="flex-row items-start justify-between">
              <View>
                <Text variant="bodyMedium" className="font-medium">
                  City
                </Text>
                <Text variant="bodyMedium" className="text-gray-600">
                  {tenantRequest.property?.city || 'N/A'}
                </Text>
              </View>
              <View>
                <Text variant="bodyMedium" className="font-medium">
                  Address
                </Text>
                <Text variant="bodyMedium" className="text-gray-600">
                  {tenantRequest.property?.address || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Unit Details (if exists) */}
        {tenantRequest.unit && (
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
                  {tenantRequest.unit?.name || 'N/A'}
                </Text>
              </View>
              <View>
                <Text variant="bodyMedium" className="font-medium">
                  Floor
                </Text>
                <Text variant="bodyMedium" className="text-gray-600">
                  {tenantRequest.floor?.name || 'N/A'}
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
                {tenantRequest.tenant?.name || 'N/A'}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Email
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {tenantRequest.tenant?.email || 'N/A'}
              </Text>
            </View>
          </View>
          <View className="flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                City
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {tenantRequest.tenant?.city || 'N/A'}
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
                {tenantRequest.owner?.name || 'N/A'}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Email
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {tenantRequest.owner?.email || 'N/A'}
              </Text>
            </View>
          </View>
          <View className="flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                City
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {tenantRequest.owner?.city || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Details */}
        {tenantRequest.booking && (
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
                  {new Date(
                    tenantRequest.booking?.start_date || ''
                  ).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              {tenantRequest.booking?.end_date && (
                <View>
                  <Text variant="bodyMedium" className="font-medium">
                    End Date
                  </Text>
                  <Text variant="bodyMedium" className="text-gray-600">
                    {new Date(
                      tenantRequest.booking?.end_date
                    ).toLocaleDateString('en-US', {
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
                  Rs{tenantRequest.booking?.total_price.toLocaleString()}
                </Text>
              </View>
            </View>
            <View className="mt-4 flex-row items-start justify-between">
              <View>
                <Text variant="bodyMedium" className="font-medium">
                  Notes
                </Text>
                <Text variant="bodyMedium" className="text-gray-600">
                  {tenantRequest.booking?.notes || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
