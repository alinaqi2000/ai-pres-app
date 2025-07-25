import * as React from 'react';
import { FlatList, View } from 'react-native';

import { useTenantBookings } from '@/api/owner';
import HeadBar from '@/components/head-bar';
import { BookingCard, SearchBar } from '@/components/ui';
import { EmptyList } from '@/components/ui';
import { useAuth } from '@/lib';
import { type Owner } from '@/models';
import { type Booking } from '@/models/booking';

export default function TenantBookings() {
  const { data, refetch, isRefetching } = useTenantBookings({
    variables: { tenantId: useAuth().user?.id || 0 },
  });
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data?.filter(
      (booking) =>
        booking.property?.name.toLowerCase().includes(query) ||
        booking.unit?.name.toLowerCase().includes(query) ||
        booking.tenant?.name.toLowerCase().includes(query) ||
        booking.total_price?.toString().toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  return (
    <View className="flex-1 gap-6">
      <HeadBar title="My Bookings" />
      <SearchBar
        placeholder="Search bookings..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <View className={filteredData?.length ? 'flex-1' : ''}>
        <FlatList
          refreshing={isRefetching}
          onRefresh={refetch}
          data={filteredData}
          renderItem={({ item, index }: { item: Booking; index: number }) => {
            const isLastItem =
              filteredData && index === filteredData.length - 1;

            return (
              <View
                style={isLastItem ? { marginBottom: 96 } : null}
                className="ml-6"
              >
                <BookingCard booking={item} user={item.owner as Owner} />
              </View>
            );
          }}
          keyExtractor={(item: Booking) => item.id.toString()}
        />
        {!filteredData?.length && <EmptyList isLoading={isRefetching} />}
      </View>
    </View>
  );
}
