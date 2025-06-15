import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { Chip } from 'react-native-paper';

import { useExploreProperties } from '@/api';
import { CITIES } from '@/data/cities';

import HeadBar from '../head-bar';
import {
  Button,
  colors,
  EmptyList,
  Modal,
  PropertyCard,
  SearchBar,
  Select,
  Text,
  useModal,
} from '../ui';
import { Filter } from '../ui/icons';

export default function Feed() {
  // const ref = useRef(null);
  const { colorScheme } = useColorScheme();
  const height = 500;
  const snapPoints = React.useMemo(() => [height], [height]);
  // Filter state
  const [minPrice, setMinPrice] = useState(0);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [city, setCity] = useState<string | number>('');
  const modal = useModal();

  const { data, refetch, isRefetching } = useExploreProperties({
    variables: {
      city: city as string,
      monthly_rent_gt: minPrice,
      monthly_rent_lt: maxPrice,
    },
  });
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data?.filter(
      (property) =>
        (property.name && property.name.toLowerCase().includes(query)) ||
        (property.address && property.address.toLowerCase().includes(query)) ||
        (property.city && property.city.toLowerCase().includes(query)) ||
        (property.property_id &&
          property.property_id.toLowerCase().includes(query)) ||
        (property.description &&
          property.description.toLowerCase().includes(query)) ||
        (property.monthly_rent &&
          property.monthly_rent.toString().toLowerCase().includes(query)) ||
        (property.total_area &&
          property.total_area.toString().toLowerCase().includes(query)) ||
        (property.property_type &&
          property.property_type.toLowerCase().includes(query))
    );
  }, [data, searchQuery]);

  return (
    <View className="flex-1 gap-6">
      <HeadBar
        title="Explore Properties"
        withBackButton={false}
        right={
          <Button
            label="Filter"
            className="rounded-full"
            icon={
              <Filter
                width={16}
                color={colorScheme === 'dark' ? 'white' : 'black'}
              />
            }
            variant="outline"
            onPress={() => modal.present()}
          />
        }
      />
      <Modal
        ref={modal.ref}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor:
            colorScheme === 'dark' ? colors.neutral[800] : colors.white,
        }}
      >
        <View className="p-4">
          <Text className="mb-4 text-lg font-bold">Filters</Text>

          {/* Price Range Filter */}
          <View className="mb-6">
            <Text className="mb-2 font-medium">Price Range</Text>
            <View className="flex-col gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600">Min Price</Text>
                <TextInput
                  value={minPrice.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text);
                    if (!isNaN(value) && value >= 0 && value <= 1000000) {
                      setMinPrice(value);
                      if (value > maxPrice) {
                        setMaxPrice(value + 5000);
                      }
                    }
                  }}
                  keyboardType="numeric"
                  placeholder="$0"
                  className="w-24 text-right text-gray-600"
                />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600">Max Price</Text>
                <TextInput
                  value={maxPrice.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text);
                    if (!isNaN(value) && value >= 0 && value <= 1000000) {
                      setMaxPrice(value);
                      if (value < minPrice) {
                        setMinPrice(value);
                      }
                    }
                  }}
                  keyboardType="numeric"
                  placeholder="$1,000,000"
                  className="w-24 text-right text-gray-600"
                />
              </View>
            </View>
          </View>

          {/* City Selection */}
          <Select
            label="City"
            value={city}
            options={CITIES}
            onSelect={(value) => {
              setCity(value);
            }}
          />
        </View>
      </Modal>
      <SearchBar
        placeholder="Search properties..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {/* showing results for */}
      {(maxPrice || minPrice || city) && (
        <View className="flex-row items-center gap-2 px-6">
          {city ? (
            <Chip
              className="rounded-full"
              icon="map-marker-radius"
              mode="outlined"
              textStyle={{
                color: colorScheme === 'dark' ? '#ffffff' : '#000000',
              }}
              closeIcon="close"
              onClose={() => setCity('')}
            >
              {city}
            </Chip>
          ) : undefined}
          {minPrice ? (
            <Chip
              className="rounded-full"
              icon="chevron-right"
              mode="outlined"
              textStyle={{
                color: colorScheme === 'dark' ? '#ffffff' : '#000000',
              }}
              closeIcon="close"
              onClose={() => setMinPrice(0)}
            >
              {minPrice}
            </Chip>
          ) : undefined}
          {maxPrice ? (
            <Chip
              className="rounded-full"
              icon="chevron-left"
              mode="outlined"
              textStyle={{
                color: colorScheme === 'dark' ? '#ffffff' : '#000000',
              }}
              closeIcon="close"
              onClose={() => setMaxPrice(0)}
            >
              {maxPrice}
            </Chip>
          ) : undefined}
        </View>
      )}
      <View className={filteredData?.length ? 'flex-1' : ''}>
        <FlatList
          refreshing={isRefetching}
          onRefresh={refetch}
          data={filteredData}
          renderItem={({ item, index }) => {
            const isLastItem =
              filteredData && index === filteredData.length - 1;

            return (
              <View style={isLastItem ? { marginBottom: 96 } : null}>
                <PropertyCard mode="feed" property={item} />
              </View>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
        />
        {!filteredData?.length && (
          <EmptyList retry={refetch} isLoading={isRefetching} />
        )}
      </View>
    </View>
  );
}
