import * as React from 'react';
import { FlatList, View } from 'react-native';

import { useTenantInvoices } from '@/api';
import HeadBar from '@/components/head-bar';
import { SearchBar } from '@/components/ui';
import { EmptyList } from '@/components/ui';
import { InvoiceCard } from '@/components/ui/invoice-card';
import { useAuth } from '@/lib';
import { type Owner } from '@/models';
import { type Invoice } from '@/models/invoice';

export default function TenantInvoices() {
  const { data, refetch, isRefetching } = useTenantInvoices({
    variables: { tenantId: useAuth().user?.id || 0 },
  });
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data?.filter(
      (invoice) =>
        invoice.reference_number.toLowerCase().includes(query) ||
        invoice.booking?.unit?.name.toLowerCase().includes(query) ||
        invoice.booking?.tenant?.name.toLowerCase().includes(query) ||
        invoice.booking?.total_price?.toString().toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  return (
    <View className="flex-1 gap-6">
      <HeadBar title="My Invoices" />
      <SearchBar
        placeholder="Search invoices..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <View className={filteredData?.length ? 'flex-1' : ''}>
        <FlatList
          refreshing={isRefetching}
          onRefresh={refetch}
          data={filteredData}
          renderItem={({ item, index }: { item: Invoice; index: number }) => {
            const isLastItem =
              filteredData && index === filteredData.length - 1;

            return (
              <View
                style={isLastItem ? { marginBottom: 96 } : null}
                className="ml-6"
              >
                <InvoiceCard invoice={item} user={item.owner as Owner} />
              </View>
            );
          }}
          keyExtractor={(item: Invoice) => item.id.toString()}
        />
        {!filteredData?.length && <EmptyList isLoading={isRefetching} />}
      </View>
    </View>
  );
}
