import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { TouchableOpacity, View } from 'react-native';
import { Avatar, Chip, Icon, List, Text } from 'react-native-paper';

import { toTitleCase } from '@/lib';
import { setCurrentInvoice, setCurrentInvoiceMode } from '@/lib/store/invoices';
import { type Owner } from '@/models';
import { type Tenant } from '@/models/booking';
import { type Invoice } from '@/models/invoice';

import colors from './colors';

type InvoiceCardProps = {
  invoice: Invoice;
  user: Owner | Tenant;
  tenantMode?: boolean;
};

export function InvoiceCard({ invoice, user, tenantMode }: InvoiceCardProps) {
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  return (
    <List.Item
      className="mr-4 mt-3 rounded-lg border border-gray-300 px-4"
      title={
        <View className="flex-row items-center">
          <View className="flex-row items-center">
            <Icon source="pound" size={16} color={colors.primary[400]} />
            <Text variant="titleSmall" className="text-gray-600">
              {invoice.reference_number}
            </Text>
          </View>
          <Chip
            style={{
              backgroundColor:
                invoice.status === 'paid'
                  ? colors.success[100]
                  : colors.danger[100],
              marginLeft: 16,
            }}
            textStyle={{
              color:
                invoice.status === 'paid'
                  ? colors.success[800]
                  : colors.danger[800],
              fontSize: 12,
            }}
          >
            {toTitleCase(invoice.status)}
          </Chip>
        </View>
      }
      left={() => (
        <Avatar.Icon
          icon="receipt"
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
      descriptionStyle={{
        color:
          colorScheme === 'dark' ? colors.charcoal[200] : colors.charcoal[600],
      }}
      description={
        <View className="flex-row items-center gap-4 pt-4">
          <View className="flex-row items-center gap-2">
            <Icon source="account" size={16} color={colors.primary[400]} />
            <Text variant="bodySmall">{user.name}</Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Icon source="cash" size={16} color={colors.primary[400]} />
            <Text variant="bodySmall">Rs{invoice.amount}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon source="calendar" size={16} color={colors.primary[400]} />
            <Text variant="bodySmall">
              {new Date(invoice.month).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      }
      right={() => (
        <TouchableOpacity
          onPress={() => {
            setCurrentInvoice(invoice);
            setCurrentInvoiceMode(tenantMode ? 'tenant' : 'owner');
            router.push(`/invoices/detail`);
          }}
        >
          <Icon source="chevron-right" size={32} />
        </TouchableOpacity>
      )}
    />
  );
}
