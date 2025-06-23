import * as React from 'react';
import { useMemo } from 'react';
import { FlatList } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';

import { useTenantBookingRequests, useTenantCancellationRequests } from '@/api';
import HeadBar from '@/components/head-bar';
import { colors, View } from '@/components/ui';
import { TenantRequestCard } from '@/components/ui/tenant-request-card';
import { useAuth } from '@/lib';

export default function TenantRequests() {
  // const router = useRouter();
  const [value, setValue] = React.useState('cancellations');

  return (
    <View className="flex-1 gap-6">
      <HeadBar title="Tenant Requests" />
      <View className="flex-col justify-start gap-10 px-4">
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={useMemo(
            () => [
              {
                checkedColor: colors.primary[500],
                style: {
                  backgroundColor:
                    value === 'cancellations'
                      ? colors.primary[50]
                      : 'transparent',
                },
                value: 'cancellations',
                label: 'Cancellations',
                icon: 'book',
              },
              {
                checkedColor: colors.primary[500],
                style: {
                  backgroundColor:
                    value === 'bookings' ? colors.primary[50] : 'transparent',
                },
                value: 'bookings',
                label: 'Bookings',
                icon: 'receipt',
              },

              {
                checkedColor: colors.primary[500],
                style: {
                  backgroundColor:
                    value === 'maintenance'
                      ? colors.primary[50]
                      : 'transparent',
                },
                value: 'maintenance',
                label: 'Maintenance',
                icon: 'message',
              },
            ],
            [value]
          )}
        />
        {value === 'cancellations' && <CancellationRequests />}
        {value === 'bookings' && <BookingRequests />}
        {value === 'maintenance' && <Maintenance />}
      </View>
    </View>
  );
}

const CancellationRequests = () => {
  const {
    data: requests,
    refetch,
    isRefetching,
  } = useTenantCancellationRequests();
  const user = useAuth.use.user();
  return (
    <FlatList
      data={requests?.filter((request) => request.owner.id !== user?.id)}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TenantRequestCard request={item} user={item.owner} />
      )}
      onRefresh={refetch}
      refreshing={isRefetching}
    />
  );
};

const BookingRequests = () => {
  const { data: requests, refetch, isRefetching } = useTenantBookingRequests();
  const user = useAuth.use.user();
  return (
    <FlatList
      data={requests?.filter((request) => request.owner.id !== user?.id)}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TenantRequestCard request={item} user={item.owner} />
      )}
      onRefresh={refetch}
      refreshing={isRefetching}
    />
  );
};
const Maintenance = () => <Text>Maintenance</Text>;
