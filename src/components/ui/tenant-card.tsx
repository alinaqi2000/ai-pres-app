import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { TouchableOpacity, View } from 'react-native';
import { Avatar, Icon, List } from 'react-native-paper';

import { type User } from '@/api/auth';
import { setCurrentTenant } from '@/lib/store/bookings';
import { setEditTenant } from '@/lib/store/tenants';

import colors from './colors';

type TenantCardProps = {
  tenant: User;
};

export function TenantCard({ tenant }: TenantCardProps) {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  return (
    <List.Item
      className="mr-4 mt-3 rounded-lg border border-gray-300 px-4"
      title={tenant.name}
      descriptionStyle={{
        color:
          colorScheme === 'dark' ? colors.charcoal[200] : colors.charcoal[600],
      }}
      description={tenant.email}
      left={() => (
        <Avatar.Text
          label={tenant.name?.[0] || 'S'}
          style={{
            backgroundColor:
              colorScheme === 'dark'
                ? colors.primary[500]
                : colors.primary[100],
          }}
          color={colorScheme === 'dark' ? '#ffffff' : '#555'}
          size={40}
        />
      )}
      right={() => (
        <View className="flex-row items-center gap-8">
          <TouchableOpacity
            onPress={() => {
              setEditTenant(tenant);
              router.push(`/tenants/manage/create`);
            }}
          >
            <Icon source="pencil" color={colors.warning[400]} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCurrentTenant(tenant);
              router.push(`/tenants/profile`);
            }}
          >
            <Icon source="chevron-right" size={32} />
          </TouchableOpacity>
        </View>
      )}
    />
  );
}
