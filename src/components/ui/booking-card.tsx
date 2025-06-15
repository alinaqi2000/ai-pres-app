import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { TouchableOpacity, View } from 'react-native';
import { Icon, List, Text } from 'react-native-paper';

import { setCurrentBooking } from '@/lib/store/bookings';
import { type Owner } from '@/models';
import { type Booking, type Tenant } from '@/models/booking';

import colors from './colors';

type BookingCardProps = {
  booking: Booking;
  user: Owner | Tenant;
};

export function BookingCard({ booking, user }: BookingCardProps) {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const bookingItemType = booking.unit ? 'unit' : 'property';

  return (
    <List.Item
      className={`mr-4 mt-3 rounded-lg border ${booking.status === 'active' ? 'border-green-300' : 'border-red-300'}`}
      title={
        bookingItemType === 'unit'
          ? `#${booking.id} - ${booking.unit?.name}`
          : `#${booking.id} - #${booking.property?.property_id}` || 'N/A'
      }
      descriptionStyle={{
        color:
          colorScheme === 'dark' ? colors.charcoal[200] : colors.charcoal[600],
      }}
      description={
        <View className="flex-row items-center gap-4 pt-2">
          <View className="flex-row items-center gap-2">
            <Icon source="account" size={16} color={colors.primary[400]} />
            <Text variant="bodySmall">{user.name}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon source="cash" size={16} color={colors.primary[400]} />
            <Text variant="bodySmall">
              Rs{booking.total_price.toLocaleString()}
            </Text>
          </View>
        </View>
      }
      right={() => (
        <TouchableOpacity
          onPress={() => {
            setCurrentBooking(booking);
            router.push(`/tenants/booking/detail`);
          }}
        >
          <Icon source="chevron-right" size={32} />
        </TouchableOpacity>
      )}
    />
  );
}
