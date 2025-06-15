import * as React from 'react';
import { FlatList, View } from 'react-native';

import { useAvailablePropertiesAndUnits } from '@/api/bookings';
import HeadBar from '@/components/head-bar';
import { SearchBar } from '@/components/ui';
import { EmptyList, ItemCard } from '@/components/ui';
import { type Item } from '@/models/item';
import { type PropertyReference } from '@/models/property';
import { type UnitReference } from '@/models/unit';

export default function Tenants() {
  const { data, refetch, isRefetching } = useAvailablePropertiesAndUnits();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data?.filter((item) => {
      if (item.type === 'property') {
        const propertyItem = item.item as PropertyReference;
        return (
          propertyItem.property_id?.toLowerCase().includes(query) ||
          propertyItem.name?.toLowerCase().includes(query)
        );
      }
      const unitItem = item.item as UnitReference;
      return (
        unitItem.id?.toString().toLowerCase().includes(query) ||
        unitItem.name?.toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery]);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <View className="flex-1 gap-6">
      <HeadBar title="Select Property" />
      <SearchBar
        placeholder="Search properties..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <View className={filteredData?.length ? 'flex-1' : ''}>
        <FlatList
          refreshing={isRefetching}
          onRefresh={refetch}
          data={filteredData}
          renderItem={({ item, index }: { item: Item; index: number }) => {
            const isLastItem =
              filteredData && index === filteredData.length - 1;

            return (
              <View
                style={isLastItem ? { marginBottom: 96 } : null}
                className="ml-4"
              >
                <ItemCard item={item} />
              </View>
            );
          }}
          keyExtractor={(item: Item) => `${item.item.id}-${item.type}`}
        />
        {!filteredData?.length && <EmptyList isLoading={isRefetching} />}
      </View>
    </View>
  );
}
