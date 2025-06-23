import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon, List, Text } from 'react-native-paper';

import { setCurrentPayment, setCurrentPaymentMode } from '@/lib/store/payments';
import { type Owner } from '@/models';
import { type Payment } from '@/models/payment';

import colors from './colors';

type PaymentCardProps = {
  payment: Payment;
  user: Owner;
  tenantMode?: boolean;
};

export function PaymentCard({ payment, user, tenantMode }: PaymentCardProps) {
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  const usePaymentStatusBorder = (status: string): string => {
    return useMemo(() => {
      switch (status) {
        case 'completed':
          return 'border-green-300';
        case 'pending':
          return 'border-yellow-300';
        case 'failed':
          return 'border-red-300';
        case 'cancelled':
          return 'border-gray-300';
        default:
          return 'border-red-300';
      }
    }, [status]);
  };

  return (
    <List.Item
      className={`mr-4 mt-3 rounded-lg border-2 ${usePaymentStatusBorder(
        payment.status
      )}`}
      title={`#${payment.transaction_id} - #INV-${payment.invoice.reference_number}`}
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
              Rs{payment.invoice.amount.toLocaleString()}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon
              source="calendar-blank"
              size={16}
              color={colors.primary[400]}
            />
            <Text variant="bodySmall">
              {new Date(payment.invoice.month).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      }
      right={() => (
        <TouchableOpacity
          onPress={() => {
            setCurrentPayment(payment);
            setCurrentPaymentMode(tenantMode ? 'tenant' : 'owner');
            router.push(`/payments/detail`);
          }}
        >
          <Icon source="chevron-right" size={32} />
        </TouchableOpacity>
      )}
    />
  );
}
