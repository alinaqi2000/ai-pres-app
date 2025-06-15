import { useRouter } from 'expo-router';
import * as React from 'react';
import { FlatList, View } from 'react-native';

import { useMyTenants } from '@/api';
import { type User } from '@/api/auth';
import FabButton from '@/components/fab-button';
import HeadBar from '@/components/head-bar';
import { SearchBar } from '@/components/ui';
import { EmptyList, TenantCard } from '@/components/ui';
import { setEditTenant, useTenantStore } from '@/lib/store/tenants';

export default function Tenants() {
  const router = useRouter();
  const editTenant = useTenantStore.use.editTenant();
  const removedTenant = useTenantStore.use.removedTenant();
  const { data, refetch, isRefetching } = useMyTenants();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data?.filter(
      (tenant) =>
        tenant.name.toLowerCase().includes(query) ||
        tenant.email.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  React.useEffect(() => {
    refetch();
  }, [editTenant, removedTenant, refetch]);

  return (
    <View className="flex-1 gap-6">
      <HeadBar title="My Tenants" />
      <SearchBar
        placeholder="Search tenants..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <View className={filteredData?.length ? 'flex-1' : ''}>
        <FlatList
          refreshing={isRefetching}
          onRefresh={refetch}
          data={filteredData}
          renderItem={({ item, index }: { item: User; index: number }) => {
            const isLastItem =
              filteredData && index === filteredData.length - 1;

            return (
              <View
                style={isLastItem ? { marginBottom: 96 } : null}
                className="ml-6"
              >
                <TenantCard tenant={item} />
              </View>
            );
          }}
          keyExtractor={(item: User) => item.id.toString()}
        />
        {!filteredData?.length && <EmptyList isLoading={isRefetching} />}
      </View>
      <FabButton
        onPress={() => {
          setEditTenant(null);
          router.push('/tenants/manage/create');
        }}
      />
    </View>
  );
}
