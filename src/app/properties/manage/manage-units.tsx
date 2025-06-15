import { useRouter } from 'expo-router';
import * as React from 'react';
import { FlatList, View } from 'react-native';

import { handleError } from '@/api';
import { useDeleteUnit, useMyUnits } from '@/api';
import FabButton from '@/components/fab-button';
import HeadBar from '@/components/head-bar';
import {
  EmptyList,
  SearchBar,
  showSuccessMessage,
  UnitCard,
} from '@/components/ui';
import { setEditFloors, usePropertyStore } from '@/lib/store/my-properties';
import { setEditFloor, setEditUnit, useUnitStore } from '@/lib/store/units';
import { type Unit } from '@/models';

export default function Units() {
  const router = useRouter();
  const editUnit = useUnitStore.use.editUnit();
  const editProperty = usePropertyStore.use.editProperty();
  const editFloors = usePropertyStore.use.editFloors();
  const editFloor = useUnitStore.use.editFloor();
  const { mutate: deleteUnit } = useDeleteUnit();
  const { data, refetch, isRefetching } = useMyUnits({
    variables: {
      property_id: editProperty?.id || 0,
      floor_id: editFloor?.id || 0,
    },
  });

  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data?.filter(
      (unit) =>
        unit.name.toLowerCase().includes(query) ||
        unit.description.toLowerCase().includes(query) ||
        unit.monthly_rent?.toString().toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  React.useEffect(() => {
    refetch();
  }, [editUnit, editUnit?.images?.length, refetch]);

  const deleteUnitHandler = (unit: Unit) => {
    deleteUnit(
      {
        property_id: editProperty?.id || 0,
        floor_id: editFloor?.id || 0,
        unitId: unit.id,
      },
      {
        onSuccess: () => {
          refetch();
          const units = editFloor?.units.filter(
            (unit) => unit.id !== editUnit?.id
          );
          if (units && editFloor) {
            setEditFloor({ ...editFloor, units });
          }
          const floors = editFloors.map((floor) => {
            if (floor.id === editFloor?.id) {
              return { ...floor, units: units || [] };
            }
            return floor;
          });
          setEditFloors(floors);
          showSuccessMessage('Unit deleted successfully');
        },
        onError: (error) => {
          handleError(error, router);
        },
      }
    );
  };

  return (
    <View className="flex-1 gap-6">
      <HeadBar title={(editFloor?.name || '') + ' Units'} />
      <SearchBar
        placeholder="Search units..."
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
                <UnitCard
                  unit={item}
                  onDelete={(unit) => deleteUnitHandler(unit)}
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
          setEditUnit(null);
          // setEditFloor(null);
          router.push('/properties/manage/create-unit');
        }}
      />
    </View>
  );
}
