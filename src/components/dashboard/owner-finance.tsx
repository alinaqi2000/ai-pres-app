import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { InvoicePayment, PaymentRequests } from '@/components/ui/icons';

import HeaderBar from '../head-bar';

interface OwnerFinanceCardProps {
  title: string;
  icon: React.ReactNode;
  count?: number;
  onPress?: () => void;
}

const OwnerFinanceCard: React.FC<OwnerFinanceCardProps> = ({
  title,
  icon,
  onPress,
}) => (
  <Card className="max-w-40% rounded-lg border-2 border-primary-100/25 bg-primary-50/25 dark:border-gray-50/5 dark:bg-gray-50/5">
    <TouchableOpacity onPress={onPress}>
      <View className="p-4">
        <View className="max-w-50% flex-col items-center justify-between gap-3">
          {icon}
          <Text className="text-sm font-semibold text-gray-500 dark:text-gray-200">
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  </Card>
);

// eslint-disable-next-line max-lines-per-function
export function OwnerFinance() {
  const router = useRouter();
  return (
    <ScrollView className="flex-1 px-4">
      <HeaderBar title="Finance" withBackButton={false} />
      {/* Quick Actions */}
      <View className="my-12">
        <View className="flex-row flex-wrap justify-evenly gap-6">
          <OwnerFinanceCard
            title="Invoices"
            icon={<InvoicePayment width={100} height={100} />}
            onPress={() => router.push('/invoices/owner')}
          />
          <OwnerFinanceCard
            title="Tenant Payments"
            icon={<PaymentRequests width={100} height={100} />}
            onPress={() => router.push('/payments/owner')}
          />
          {/* <OwnerFinanceCard
            title="Manage Tenants"
            icon={<Tenants width={100} height={100} />}
            onPress={() => router.push('/tenants')}
          />
          <OwnerFinanceCard
            title="Bookings"
            icon={<PropertySetting width={100} height={100} />}
            onPress={() => router.push('/bookings/owner')}
          /> */}
        </View>
      </View>
    </ScrollView>
  );
}
