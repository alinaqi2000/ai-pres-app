import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-paper';

import { Card } from '@/components/ui/card';
import {
  InvoicePayment,
  PropertySetting,
  TenantRequest,
} from '@/components/ui/icons';
import { useAuth } from '@/lib';

import { Logo } from '../logo';
import { colors } from '../ui';

interface TenantDashboardCardProps {
  title: string;
  icon: React.ReactNode;
  count?: number;
  onPress?: () => void;
}

const TenantDashboardCard: React.FC<TenantDashboardCardProps> = ({
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

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'Good Morning!';
  if (hour >= 12 && hour < 17) return 'Good Afternoon!';
  return 'Good Evening!';
};

// eslint-disable-next-line max-lines-per-function
export function TenantDashboard() {
  const user = useAuth.use.user();
  const router = useRouter();
  return (
    <ScrollView className="flex-1 px-4">
      <View className="items-center justify-center">
        <Logo />
      </View>
      {/* Greeting Section */}
      <View className="items-center justify-center px-3">
        <View className="flex-row items-center">
          <Avatar.Text
            className="border-2 border-primary-300"
            style={{ backgroundColor: colors.primary[50] }}
            labelStyle={{
              color: colors.primary[900],
              fontWeight: '700',
              marginTop: -3,
            }}
            label={user?.name?.[0] || 'S'}
            size={48}
          />
          <View className="ml-4">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {getTimeBasedGreeting()}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400">
              Welcome back, {user?.name}
            </Text>
          </View>
        </View>
      </View>
      {/* Quick Actions */}
      <View className="my-12">
        <View className="flex-row flex-wrap justify-evenly gap-6">
          <TenantDashboardCard
            title="My Requests"
            icon={<TenantRequest width={100} height={100} />}
            onPress={() => router.push('/tenant-requests')}
          />
          <TenantDashboardCard
            title="Bookings"
            icon={<PropertySetting width={100} height={100} />}
            onPress={() => router.push('/bookings/tenant')}
          />
          <TenantDashboardCard
            title="Invoices"
            icon={<InvoicePayment width={100} height={100} />}
            onPress={() => router.push('/invoices/tenant')}
          />
        </View>
      </View>
    </ScrollView>
  );
}
