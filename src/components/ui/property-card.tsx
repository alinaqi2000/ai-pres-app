import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Alert, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Card, Icon, Text } from 'react-native-paper';

import { setCurrentProperty, setEditProperty } from '@/lib/store/my-properties';
import { toTitleCase } from '@/lib/utils';
import { type Property } from '@/models';

import colors from './colors';

const PropertyTypeIcon = (props: any) => {
  const { colorScheme } = useColorScheme();
  return (
    <Avatar.Icon
      {...props}
      icon={props.icon || 'home'}
      style={{
        backgroundColor:
          colorScheme === 'dark' ? colors.primary[600] : colors.primary[200],
      }}
      color={colorScheme === 'dark' ? '#ffffff' : '#555'}
      size={40}
    />
  );
};

type PropertyCardProps = {
  property: Property;
  mode?: 'owner' | 'feed';
  onDelete?: (property: Property) => void;
  onUpdateStatus?: (property: Property) => void;
};

export function PropertyCard({
  property,
  mode = 'owner',
  onDelete,
  onUpdateStatus,
}: PropertyCardProps) {
  const propertyTypeIcon =
    property.property_type === 'building' ? 'office-building' : 'home';
  const statusColor = property.is_published
    ? colors.success[500]
    : colors.warning[500];

  return (
    <Card
      className="mx-4 my-1"
      style={{ borderRadius: 0 }}
      onPress={
        mode === 'feed'
          ? () => {
            setCurrentProperty(property);
            router.push(`/feed/property/detail`);
          }
          : undefined
      }
    >
      {property.thumbnail && (
        <Card.Cover
          style={{ borderRadius: 10 }}
          source={{ uri: property.thumbnail.image_url }}
        />
      )}
      {/* {!property.thumbnail && (
        <View className="h-[150px]  items-center justify-center bg-gray-100">
          <Icon source="image-off" size={40} color="#ccc" />
        </View>
      )} */}

      <Card.Title
        style={{ marginTop: !property.thumbnail ? 10 : 0 }}
        title={
          <View className="flex-row items-center pt-1">
            <Icon source="pound" size={16} color={colors.primary[400]} />
            <Text variant="titleMedium" className="text-gray-600">
              {property.property_id} • {toTitleCase(property.property_type)}
            </Text>
          </View>
        }
        subtitle={
          <Text variant="bodySmall" className="pl-2">
            {toTitleCase(property.address)}
          </Text>
        }
        left={(props) => (
          <PropertyTypeIcon
            className="ml-1"
            {...props}
            icon={propertyTypeIcon}
          />
        )}
        right={(_props) => (
          <View className="mx-2 pr-4">
            {mode === 'owner' ? (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Change Property Status',
                    `Are you sure you want to make your property ${property.is_published ? 'private' : 'public'}?`,
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: property.is_published ? 'Private' : 'Public',
                        style: 'default',
                        onPress: () => onUpdateStatus?.(property),
                      },
                    ]
                  );
                }}
                className="self-start rounded-xl px-2 py-1"
                style={{ backgroundColor: `${statusColor}20` }}
              >
                <Text style={{ color: statusColor }} className="text-xs">
                  {property.is_published ? 'Public' : 'Private'}
                </Text>
              </TouchableOpacity>
            ) : undefined}
          </View>
        )}
      />

      <Card.Content className="my-2">
        <View className="m-2 flex-row justify-between">
          <View className="flex-row items-center">
            <Icon source="map-marker" size={16} color={colors.primary[400]} />
            <Text variant="bodySmall" className="ml-1 text-gray-600">
              {toTitleCase(property.city)}
            </Text>
          </View>
          {property.monthly_rent ? (
            <View className="flex-row items-center">
              <Icon source="cash" size={16} color={colors.primary[400]} />
              <Text variant="bodySmall" className="ml-1 text-gray-600">
                Rs{property.monthly_rent.toLocaleString()} / month
              </Text>
            </View>
          ) : undefined}
          {property.total_area ? (
            <View className="flex-row items-center">
              <Icon source="ruler" size={16} color={colors.primary[400]} />
              <Text variant="bodySmall" className="ml-2 text-gray-600">
                {property.total_area} sq.ft
              </Text>
            </View>
          ) : undefined}
        </View>

        {property.description && (
          <Text
            variant="bodyMedium"
            numberOfLines={2}
            className="mx-2 mt-2 text-gray-800"
          >
            {property.description}
          </Text>
        )}
      </Card.Content>

      <Card.Actions
        style={{ justifyContent: 'space-between' }}
        className="rounded-lg px-4 pb-4"
      >
        <View className="flex-row items-center">
          <Icon source="bed" size={16} color={colors.primary[400]} />
          <Text variant="bodySmall" className="ml-1 text-gray-600">
            {property.meta?.total_floors} floor
            {property.meta?.total_floors && property.meta?.total_floors > 1
              ? 's'
              : ''}{' '}
            •{' '}
            {mode === 'feed' ? property.meta?.total_unoccupied_units + '/' : ''}
            {property.meta?.total_units} unit
            {property.meta?.total_units && property.meta?.total_units > 1
              ? 's'
              : ''}
          </Text>
        </View>
        {mode === 'owner' ? (
          <View className="flex-row items-center">
            <Button
              mode="text"
              onPress={() => {
                setEditProperty(property);
                router.push('/properties/manage/create');
              }}
              textColor={colors.warning[400]}
              icon="pencil"
            >
              Edit
            </Button>
            <Button
              mode="text"
              onPress={() => {
                Alert.alert(
                  'Delete Property',
                  'Are you sure you want to delete this property?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => onDelete?.(property),
                    },
                  ]
                );
              }}
              textColor={colors.danger[400]}
              icon="delete"
            >
              Delete
            </Button>
          </View>
        ) : undefined}
      </Card.Actions>
    </Card>
  );
}
