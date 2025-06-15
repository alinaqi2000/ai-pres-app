import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { TouchableOpacity } from 'react-native';
import { Icon, List } from 'react-native-paper';

// eslint-disable-next-line import/no-cycle
import { toTitleCase } from '@/lib';
import { setCurrentItem } from '@/lib/store/bookings';
import { type Item } from '@/models/item';
import { type PropertyReference } from '@/models/property';
import { type UnitReference } from '@/models/unit';

import colors from './colors';
import { Text } from './text';

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  const title =
    item.type === 'property'
      ? `#${(item.item as PropertyReference).property_id}`
      : `#${(item.item as UnitReference).id}`;
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  return (
    <List.Item
      className="mr-4 mt-3 rounded-lg border border-gray-300"
      title={title}
      descriptionStyle={{
        color:
          colorScheme === 'dark' ? colors.charcoal[200] : colors.charcoal[600],
      }}
      description={
        <Text
          className="text-sm"
          style={{
            color:
              item.type === 'property'
                ? colors.primary[600]
                : colors.warning[600],
          }}
        >
          {toTitleCase(item.type)} - {item.item.name}
        </Text>
      }
      right={() => (
        <TouchableOpacity
          onPress={() => {
            setCurrentItem(item);
            router.replace(`/tenants/booking/create-booking`);
          }}
        >
          <Icon source="chevron-right" size={32} />
        </TouchableOpacity>
      )}
    />
  );
}
