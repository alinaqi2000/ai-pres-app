import { useRouter } from 'expo-router';
import * as React from 'react';
import { FlatList } from 'react-native';
import { Avatar, SegmentedButtons, Text } from 'react-native-paper';

import { useTenantBookings } from '@/api/bookings';
import { useTenantInvoices } from '@/api/invoices';
import HeadBar from '@/components/head-bar';
import { Button, colors, View } from '@/components/ui';
import { BookingCard } from '@/components/ui/booking-card';
import { InvoiceCard } from '@/components/ui/invoice-card';
import { useBookingStore } from '@/lib/store/bookings';
import { type Tenant } from '@/models/booking';

// eslint-disable-next-line max-lines-per-function
export default function TenantProfile() {
  const router = useRouter();
  const currentTenant = useBookingStore.use.currentTenant();
  const [value, setValue] = React.useState('bookings');

  return (
    <View className="flex-1 gap-6">
      <HeadBar title="Tenant Profile" />
      <View className="flex-col justify-start gap-10 px-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Avatar.Text
              className="border-2 border-primary-300"
              style={{ backgroundColor: colors.primary[50] }}
              labelStyle={{
                color: colors.primary[900],
                fontWeight: '700',
                marginTop: -3,
              }}
              label={currentTenant?.name?.[0] || 'S'}
              size={48}
            />
            <View className="ml-4">
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {currentTenant?.name}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400">
                {currentTenant?.email}
              </Text>
            </View>
          </View>
          <Button
            label="Assign"
            onPress={() => {
              router.push(`/tenants/manage/select-item`);
            }}
          />
        </View>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              checkedColor: colors.primary[500],
              value: 'bookings',
              label: 'Bookings',
              icon: 'book',
            },
            {
              checkedColor: colors.primary[500],
              value: 'invoices',
              label: 'Invoices',
              icon: 'receipt',
            },

            {
              checkedColor: colors.primary[500],
              value: 'requests',
              label: 'Requests',
              icon: 'message',
            },
          ]}
        />
        {value === 'bookings' && <Bookings tenantId={currentTenant?.id || 0} />}
        {value === 'invoices' && <Invoices tenantId={currentTenant?.id || 0} />}
        {/* {value === 'requests' && <Requests tenantId={currentTenant?.id || 0} />} */}
      </View>
    </View>
  );
}

const Bookings = ({ tenantId }: { tenantId: number }) => {
  const { data: bookings } = useTenantBookings({ variables: { tenantId } });

  return (
    <FlatList
      data={bookings}
      renderItem={({ item }) => (
        <BookingCard booking={item} user={item.tenant as Tenant} />
      )}
    />
  );
};
const Invoices = ({ tenantId }: { tenantId: number }) => {
  const { data: invoices } = useTenantInvoices({ variables: { tenantId } });
  return (
    <FlatList
      data={invoices}
      renderItem={({ item }) => (
        <InvoiceCard invoice={item} user={item.tenant as Tenant} />
      )}
    />
  );
};
// const Requests = ({ tenantId }: { tenantId: number }) => <Text>Requests</Text>;
