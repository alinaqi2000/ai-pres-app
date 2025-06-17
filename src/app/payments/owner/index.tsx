import * as React from 'react';
import { FlatList, View } from 'react-native';

import { useOwnerPayments } from '@/api/payments';
import HeadBar from '@/components/head-bar';
import { PaymentCard, SearchBar } from '@/components/ui';
import { EmptyList } from '@/components/ui';
import { type Tenant } from '@/models/booking';
import { type Payment } from '@/models/payment';

export default function OwnerPayments() {
  const { data, refetch, isRefetching } = useOwnerPayments();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data?.filter(
      (payment) =>
        payment.transaction_id.toLowerCase().includes(query) ||
        payment.status.toLowerCase().includes(query) ||
        payment.payment_method?.name.toLowerCase().includes(query) ||
        payment.invoice.reference_number.toLowerCase().includes(query) ||
        payment.owner?.name.toLowerCase().includes(query) ||
        payment.tenant?.name.toLowerCase().includes(query) ||
        payment.invoice.amount.toString().toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  return (
    <View className="flex-1 gap-6">
      <HeadBar title="Tenant Payments" />
      <SearchBar
        placeholder="Search payments..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <View className={filteredData?.length ? 'flex-1' : ''}>
        <FlatList
          refreshing={isRefetching}
          onRefresh={refetch}
          data={filteredData}
          renderItem={({ item, index }: { item: Payment; index: number }) => {
            const isLastItem =
              filteredData && index === filteredData.length - 1;

            return (
              <View
                style={isLastItem ? { marginBottom: 96 } : null}
                className="ml-6"
              >
                <PaymentCard payment={item} user={item.tenant as Tenant} />
              </View>
            );
          }}
          keyExtractor={(item: Payment) => item.id.toString()}
        />
        {!filteredData?.length && <EmptyList isLoading={isRefetching} />}
      </View>
    </View>
  );
}
