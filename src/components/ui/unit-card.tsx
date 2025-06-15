import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Alert, View } from 'react-native';
import {
  Avatar,
  Button as RNButton,
  Card,
  Chip,
  Icon,
  Text as RNText,
} from 'react-native-paper';

import { setEditUnit } from '@/lib/store/units';
import { toTitleCase } from '@/lib/utils';
import type { Unit } from '@/models/unit';

import colors from './colors';
import { Text } from './text';

const UnitTypeIcon = (props: any) => {
  const { colorScheme } = useColorScheme();
  return (
    <Avatar.Icon
      {...props}
      icon={props.icon || 'office'}
      style={{
        backgroundColor:
          colorScheme === 'dark' ? colors.primary[500] : colors.primary[100],
      }}
      color={colorScheme === 'dark' ? '#ffffff' : '#555'}
      size={40}
    />
  );
};

type UnitCardProps = {
  unit: Unit;
  onDelete: (unit: Unit) => void;
};

export function UnitCard({ unit, onDelete }: UnitCardProps) {
  let unitTypeIcon = 'home';
  switch (unit.unit_type) {
    case 'office':
      unitTypeIcon = 'briefcase';
      break;
    case 'shop':
      unitTypeIcon = 'store';
      break;
    case 'room':
      unitTypeIcon = 'home';
      break;
    default:
      break;
  }

  const statusColor = unit.is_occupied
    ? colors.success[500]
    : colors.warning[500];
  const { colorScheme } = useColorScheme();

  return (
    <Card className="mx-4 my-1" style={{ borderRadius: 0 }}>
      {unit.images.length > 0 && (
        <Card.Cover
          style={{ borderRadius: 10 }}
          source={{ uri: unit.images[0].image_url }}
        />
      )}

      <Card.Title
        style={{ marginTop: !unit.images.length ? 10 : 0 }}
        title={unit.name}
        subtitle={toTitleCase(unit.unit_type)}
        left={(props) => (
          <UnitTypeIcon className="ml-1" {...props} icon={unitTypeIcon} />
        )}
        right={(_props) => (
          <View className="mx-2 pr-4">
            <View
              className="self-start rounded-xl px-2 py-1"
              style={{ backgroundColor: `${statusColor}20` }}
            >
              <RNText style={{ color: statusColor }} className="text-xs">
                {unit.is_occupied ? 'Occupied' : 'Available'}
              </RNText>
            </View>
          </View>
        )}
      />

      <Card.Content className="my-2">
        <View className="m-2 flex-row justify-between">
          <View className="flex-row items-center">
            <Icon source="cash" size={16} color={colors.primary[400]} />
            <RNText variant="bodySmall" className="ml-1 text-gray-600">
              Rs{unit.monthly_rent.toLocaleString()} / month
            </RNText>
          </View>
          <View className="flex-row items-center">
            <Icon source="ruler" size={16} color={colors.primary[400]} />
            <RNText variant="bodySmall" className="ml-2 text-gray-600">
              {unit.area} sq.ft
            </RNText>
          </View>
        </View>

        {unit.description && (
          <RNText
            variant="bodyMedium"
            numberOfLines={2}
            className="mx-2 mt-2 text-gray-800"
          >
            {unit.description}
          </RNText>
        )}

        <View className="mx-2 mt-2 flex-row flex-wrap gap-2">
          {unit.has_washroom && (
            <Chip
              theme={{
                colors: {
                  primary:
                    colors.danger[colorScheme === 'dark' ? '100' : '500'],
                },
              }}
              icon="toilet"
              style={{
                backgroundColor:
                  colors.danger[colorScheme === 'dark' ? '900' : '100'],
              }}
            >
              <Text className="text-sm">Washroom</Text>
            </Chip>
          )}
          {unit.has_air_conditioning && (
            <Chip
              theme={{
                colors: {
                  primary:
                    colors.warning[colorScheme === 'dark' ? '100' : '500'],
                },
              }}
              icon="air-conditioner"
              style={{
                backgroundColor:
                  colors.warning[colorScheme === 'dark' ? '900' : '100'],
              }}
            >
              <Text className="text-sm">AC</Text>
            </Chip>
          )}
          {unit.has_internet && (
            <Chip
              theme={{
                colors: {
                  primary:
                    colors.success[colorScheme === 'dark' ? '100' : '500'],
                },
              }}
              icon="wifi"
              style={{
                backgroundColor:
                  colors.success[colorScheme === 'dark' ? '900' : '100'],
              }}
            >
              <Text className="text-sm">Internet</Text>
            </Chip>
          )}
        </View>
      </Card.Content>

      <Card.Actions style={{}} className="rounded-lg px-4 pb-4">
        <RNButton
          mode="text"
          theme={{
            colors: {
              primary: colors.warning[400],
            },
          }}
          onPress={() => {
            setEditUnit(unit);
            router.push('/properties/manage/create-unit');
          }}
          icon="pencil"
        >
          Edit
        </RNButton>
        <RNButton
          mode="text"
          theme={{
            colors: {
              primary: colors.danger[400],
            },
          }}
          onPress={() => {
            Alert.alert(
              'Delete Unit',
              'Are you sure you want to delete this unit?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => onDelete(unit),
                },
              ]
            );
          }}
          icon="delete"
        >
          Delete
        </RNButton>
      </Card.Actions>
    </Card>
  );
}
