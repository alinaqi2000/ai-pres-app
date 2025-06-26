import { useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView } from 'react-native';
import { Chip, Icon, Text } from 'react-native-paper';

import { useGetInvoice } from '@/api/invoices/use-invoices';
import HeadBar from '@/components/head-bar';
import { Button, colors, View } from '@/components/ui';
import { setCurrentInvoice, useInvoiceStore } from '@/lib/store/invoices';

export default function InvoiceDetail() {
  const router = useRouter();
  const tenantMode = useInvoiceStore.use.currentInvoiceMode() === 'tenant';
  const { data: invoice, isLoading } = useGetInvoice({
    variables: {
      invoiceId: useInvoiceStore.use.currentInvoice()?.id || 0,
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!invoice) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Invoice not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <HeadBar
        title={`Invoice`}
        right={
          invoice.status !== 'paid' && tenantMode ? (
            <Button
              style={{ height: 32 }}
              label="Pay"
              onPress={() => {
                setCurrentInvoice(invoice);
                router.push('/invoices/payment/create');
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
                {invoice.reference_number}
              </Text>
            </View>
            <Text variant="bodyMedium" className="text-gray-600">
              {new Date(invoice.month).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
          <Chip
            style={{
              backgroundColor:
                invoice.status === 'paid' ? '#dcfce7' : '#fee2e2',
            }}
            textStyle={{
              color: invoice.status === 'paid' ? '#166534' : '#991b1b',
              fontSize: 14,
              fontWeight: '600',
            }}
          >
            {invoice.status.toUpperCase()}
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
                {invoice.booking.property?.property_id || 'N/A'}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Property Name
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {invoice.booking.property?.name || 'N/A'}
              </Text>
            </View>
          </View>
          <View className="flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                City
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {invoice.booking.property?.city || 'N/A'}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Address
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {invoice.booking.property?.address || 'N/A'}
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
                {new Date(invoice.booking.start_date).toLocaleDateString(
                  'en-US',
                  {
                    month: 'long',
                    year: 'numeric',
                    day: 'numeric',
                  }
                )}
              </Text>
            </View>
            {invoice.booking.end_date && (
              <View>
                <Text variant="bodyMedium" className="font-medium">
                  End Date
                </Text>
                <Text variant="bodyMedium" className="text-gray-600">
                  {new Date(invoice.booking.end_date).toLocaleDateString(
                    'en-US',
                    {
                      month: 'long',
                      year: 'numeric',
                      day: 'numeric',
                    }
                  )}
                </Text>
              </View>
            )}
          </View>
        </View>

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
                {invoice.tenant?.name || 'N/A'}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Email
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {invoice.tenant?.email || 'N/A'}
              </Text>
            </View>
          </View>
          <View className="flex-row items-start justify-between">
            {/* <View>
              <Text variant="bodyMedium" className="font-medium">Phone</Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {invoice.tenant?.phone || 'N/A'}
              </Text>
            </View> */}
            <View>
              <Text variant="bodyMedium" className="font-medium">
                City
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {invoice.tenant?.city || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View className="mb-3 rounded-lg bg-gray-50 p-4 dark:bg-charcoal-900">
          <Text variant="titleMedium" className="mb-2 font-semibold">
            Payment Details
          </Text>
          <View className="mb-4 flex-row items-start justify-between">
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Reference Number
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {invoice.reference_number}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium" className="font-medium">
                Created At
              </Text>
              <Text variant="bodyMedium" className="text-gray-600">
                {new Date(invoice.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          <View className="border-t border-gray-300 pt-4">
            {/* <Text variant="titleMedium" className="mb-2 font-semibold">
              Items
            </Text> */}
            {invoice.line_items.map((item, index) => (
              <View
                key={index}
                className="mb-2 flex-row items-start justify-between"
              >
                <Text variant="bodyMedium" className="text-gray-600">
                  {item.description}
                </Text>
                <Text variant="bodyMedium" className="font-medium">
                  Rs{item.amount.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-4 flex-row items-start justify-between">
            <Text variant="titleMedium" className="font-semibold">
              Total Amount
            </Text>
            <Text variant="titleMedium" className="font-bold text-primary-600">
              Rs{invoice.amount.toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
