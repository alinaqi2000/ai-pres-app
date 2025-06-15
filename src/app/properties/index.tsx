import { useRouter } from 'expo-router';
import * as React from 'react';
import { FlatList, View } from 'react-native';

import {
  handleError,
  useDeleteProperty,
  useMyProperties,
  useUpdatePropertyStatus,
} from '@/api';
import FabButton from '@/components/fab-button';
import HeadBar from '@/components/head-bar';
import { SearchBar } from '@/components/ui';
import { EmptyList, PropertyCard } from '@/components/ui';
import {
  setEditImages,
  setEditProperty,
  setEditThumbnail,
  usePropertyStore,
} from '@/lib/store/my-properties';
import { useUnitStore } from '@/lib/store/units';
import { type Property } from '@/models';

export default function Properties() {
  const router = useRouter();
  const editProperty = usePropertyStore.use.editProperty();
  const editFloor = useUnitStore.use.editFloor();
  const editImages = usePropertyStore.use.editImages();
  const editThumbnail = usePropertyStore.use.editThumbnail();
  const { data, refetch, isRefetching } = useMyProperties();
  const { mutate: deleteProperty } = useDeleteProperty();
  const { mutate: updatePropertyStatus } = useUpdatePropertyStatus();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data?.filter(
      (property) =>
        property.name.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.property_id.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.monthly_rent?.toString().toLowerCase().includes(query) ||
        '' ||
        property.total_area?.toString().toLowerCase().includes(query) ||
        '' ||
        property.property_type.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  React.useEffect(() => {
    refetch();
  }, [editProperty, editImages, editThumbnail, editFloor, refetch]);

  const deletePropertyHandler = (property: Property) => {
    deleteProperty(
      {
        id: property.id,
      },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (error) => {
          handleError(error, router);
        },
      }
    );
  };

  const updatePropertyStatusHandler = (property: Property) => {
    updatePropertyStatus(
      {
        id: property.id,
        is_published: !property.is_published,
      },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (error) => {
          handleError(error, router);
        },
      }
    );
  };

  return (
    <View className="flex-1 gap-6">
      <HeadBar title="My Properties" />
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
          renderItem={({ item, index }) => {
            const isLastItem =
              filteredData && index === filteredData.length - 1;

            return (
              <View style={isLastItem ? { marginBottom: 96 } : null}>
                <PropertyCard
                  property={item}
                  onUpdateStatus={(property) =>
                    updatePropertyStatusHandler(property)
                  }
                  onDelete={(property) => deletePropertyHandler(property)}
                />
              </View>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
        />
        {!filteredData?.length && <EmptyList isLoading={isRefetching} />}
      </View>
      <FabButton
        onPress={() => {
          setEditProperty(null);
          setEditImages([]);
          setEditThumbnail(null);
          router.push('/properties/manage/create');
        }}
      />
    </View>
  );
}
