import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon, List } from 'react-native-paper';

// eslint-disable-next-line import/no-cycle
import { toTitleCase } from '@/lib';
import { setCurrentTenantRequest } from '@/lib/store/tenant-requests';
import { type Booking, type Tenant } from '@/models/booking';
import { type Owner, type PropertyReference } from '@/models/property';
import { type TenantRequest } from '@/models/tenant-request';

import colors from './colors';
import { Text } from './text';

type TenantRequestCardProps = {
  request: TenantRequest;
  user: Owner | Tenant;
};

export function TenantRequestCard({ request, user }: TenantRequestCardProps) {
  const title =
    request.type === 'cancellation'
      ? `#${(request.booking as Booking).id} - Booking`
      : `#${(request.property as PropertyReference).property_id} - Property`;
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  const useTenantRequestStatusBorder = (status: string): string => {
    return useMemo(() => {
      switch (status) {
        case 'pending':
          return 'border-yellow-300';
        case 'rejected':
          return 'border-red-300';
        default:
          return 'border-green-300';
      }
    }, [status]);
  };

  return (
    <List.Item
      className={`mr-4 mt-3 rounded-lg border-2 ${useTenantRequestStatusBorder(
        request.status
      )}`}
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
              request.type === 'booking'
                ? colors.primary[600]
                : colors.warning[600],
          }}
        >
          {toTitleCase(request.type)} - {user.name}
        </Text>
      }
      right={() => (
        <TouchableOpacity
          onPress={() => {
            setCurrentTenantRequest(request);
            router.push(`/tenants/requests/detail`);
          }}
        >
          <Icon source="chevron-right" size={32} />
        </TouchableOpacity>
      )}
    />
  );
}
