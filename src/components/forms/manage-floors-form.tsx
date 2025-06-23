import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { sortBy } from 'lodash';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Alert, Dimensions, FlatList, TextInput, View } from 'react-native';
import { List, Tooltip } from 'react-native-paper';
import { Button as RNButton } from 'react-native-paper';

import { Button } from '@/components/ui/button';
import { getFloorSuffix } from '@/lib';
import { usePropertyStore } from '@/lib/store/my-properties';
import { setEditFloor } from '@/lib/store/units';
import { type Floor } from '@/models/floor';

import { Trash } from '../ui/icons';

export type ManageFloorsFormProps = {
  onSubmitFloor: (data: { floor: any }) => void;
  onFloorDelete: (data: { floorId: number }) => void;
  isLoading: boolean;
};

// eslint-disable-next-line max-lines-per-function
export const ManageFloorsForm = ({
  onSubmitFloor,
  onFloorDelete,
  isLoading,
}: ManageFloorsFormProps) => {
  const editFloors = usePropertyStore.use.editFloors();
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  const [newFloorNumber, setNewFloorNumber] = React.useState('0');

  const handleAddFloor = () => {
    const floorNumber = parseInt(newFloorNumber);
    if (!isNaN(floorNumber)) {
      onSubmitFloor({ floor: { number: floorNumber } });
      const existingFloors = [
        ...editFloors.map((floor) => floor.number),
        floorNumber,
      ];
      // Find next available floor number
      let nextNumber = 0;
      while (existingFloors.includes(nextNumber)) {
        nextNumber++;
      }

      setNewFloorNumber(nextNumber.toString());
    }
  };

  React.useEffect(() => {
    const existingFloors = [
      ...editFloors.map((floor) => floor.number),
      parseInt(newFloorNumber),
    ];
    // Find next available floor number
    let nextNumber = 0;
    while (existingFloors.includes(nextNumber)) {
      nextNumber++;
    }
    setNewFloorNumber(nextNumber.toString());
  }, [editFloors]);

  const handleDeleteFloor = (floor: Floor) => {
    if (floor.units?.length > 0) {
      Alert.alert(
        'Caution',
        'This floor has units. Please delete the units first.',
        [
          {
            text: 'OK',
            onPress: () => { },
          },
        ]
      );
      return;
    }
    Alert.alert(
      'Delete Floor',
      'Are you sure you want to delete this floor? All units on this floor will also be deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onFloorDelete({ floorId: floor.id }),
        },
      ]
    );
  };

  const handleIncrement = () => {
    const current = parseInt(newFloorNumber);
    if (!isNaN(current)) {
      setNewFloorNumber((current + 1).toString());
    }
  };

  const handleDecrement = () => {
    const current = parseInt(newFloorNumber);
    if (!isNaN(current) && current > 0) {
      setNewFloorNumber((current - 1).toString());
    }
  };

  const renderFloorItem = ({ item }: { item: Floor }) => (
    <View className="my-2 rounded-xl border border-gray-200 dark:border-gray-500">
      <List.Item
        titleStyle={{ fontWeight: 'bold' }}
        title={item.name}
        descriptionStyle={{
          color: colorScheme === 'dark' ? '#ffffff' : '#000000',
        }}
        description={(item.units?.length?.toString() || 0) + ' units'}
        right={(props) => (
          <View className="flex-row items-center">
            <Button
              variant="link"
              onPress={() => handleDeleteFloor(item)}
              {...props}
              icon={<Trash color="red" />}
            />
            <Tooltip title="View Floor">
              <RNButton
                mode="text"
                contentStyle={{ flexDirection: 'row-reverse' }}
                onPress={() => {
                  setEditFloor(item);
                  router.push(`/properties/manage/manage-units`);
                }}
                {...props}
                icon="chevron-right"
                textColor={colorScheme === 'dark' ? '#ffffff' : '#000000'}
              >
                Units
              </RNButton>
            </Tooltip>
          </View>
        )}
      />
    </View>
  );

  return (
    <View className="mt-6 flex-col gap-6">
      <View className="flex-row space-x-4">
        <View className="flex-1">
          <View className="flex-row items-center justify-between gap-2 rounded-lg bg-primary-100 p-2">
            <View className="flex-1 flex-row items-center justify-between gap-2">
              <Button
                style={{ flex: 1 }}
                variant="link"
                onPress={handleDecrement}
              >
                <MaterialIcons name="remove" size={16} color="#4B5563" />
              </Button>
              <TextInput
                style={{ flex: 1 }}
                className="text-center"
                placeholder="0"
                value={newFloorNumber}
                onChangeText={setNewFloorNumber}
                keyboardType="numeric"
              />
              <Button
                style={{ flex: 1 }}
                variant="link"
                onPress={handleIncrement}
              >
                <MaterialIcons name="add" size={16} color="#4B5563" />
              </Button>
            </View>
            <Button
              style={{ flex: 1 }}
              variant="default"
              onPress={handleAddFloor}
              loading={isLoading}
              className="rounded-lg dark:bg-black"
              textClassName="dark:text-white"
              label={`Add ${getFloorSuffix(parseInt(newFloorNumber))}`}
            />
          </View>
        </View>
      </View>
      <FlatList
        style={{
          height: Dimensions.get('window').height - 240,
        }}
        data={sortBy(editFloors, (floor) => floor.number)}
        renderItem={renderFloorItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};
