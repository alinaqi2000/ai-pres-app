import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RefreshControl } from 'react-native';
import { Avatar } from 'react-native-paper';

import { useTenantReports } from '@/api/shared';
import { Card } from '@/components/ui/card';
import {
  InvoicePayment,
  PropertySetting,
  TenantRequest,
} from '@/components/ui/icons';
import { formatCurrency, useAuth } from '@/lib';

import { Logo } from '../logo';
import { colors } from '../ui';
import { BookingStatCircle } from './owner-finance';

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
  const { data: tenantReports, isLoading, refetch } = useTenantReports();

  return (
    <ScrollView
      className="flex-1 px-4"
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <View className="mt-4 flex-row items-center justify-between px-3">
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
        <Logo className="size-24" />
      </View>
      {/* Financial Overview */}
      {isLoading ? (
        <View className="my-6 items-center justify-center py-8">
          <Text className="text-gray-500 dark:text-gray-400">
            Loading financial data...
          </Text>
        </View>
      ) : tenantReports ? (
        <View className="my-6 px-3">
          {/* Summary Cards */}
          <View className="mb-6 flex-row flex-wrap justify-between gap-4">
            <Card className="flex-1 overflow-hidden rounded-xl border-2 border-primary-100/25 bg-white shadow-sm dark:bg-charcoal-900">
              <View className="p-4">
                <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Payments
                </Text>
                <Text className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(tenantReports.payment_stats.total_given || 0)}
                </Text>
                <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Upcoming:{' '}
                  {formatCurrency(tenantReports.payment_stats.total_upcoming)}
                </Text>
              </View>
            </Card>

            <Card className="flex-1 overflow-hidden rounded-xl border-2 border-primary-100/25 bg-white shadow-sm dark:bg-charcoal-900">
              <View className="p-4">
                <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Invoice Status
                </Text>
                <Text className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {tenantReports.invoice_stats.total_paid}
                </Text>
                <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Overdue: {tenantReports.invoice_stats.total_overdue}
                </Text>
              </View>
            </Card>
          </View>

          {/* Booking Stats */}
          <Card className="mb-2 overflow-hidden rounded-xl border-2 border-primary-100/25 bg-white shadow-sm dark:bg-charcoal-900">
            <View className="p-4">
              <Text className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-100">
                Booking Statistics
              </Text>
              <View className="flex-row items-center justify-around py-2">
                <BookingStatCircle
                  title="Active"
                  count={tenantReports.booking_stats.active}
                  total={tenantReports.booking_stats.total}
                  color="#22c55e"
                />
                <BookingStatCircle
                  title="Closed"
                  count={tenantReports.booking_stats.closed}
                  total={tenantReports.booking_stats.total}
                  color="#6366f1"
                />
              </View>
            </View>
          </Card>
        </View>
      ) : (
        <View className="my-6 items-center justify-center py-8">
          <Text className="text-gray-500 dark:text-gray-400">
            No financial data available
          </Text>
        </View>
      )}
      {/* Quick Actions */}
      <View className="mb-6">
        <View className="flex-row flex-wrap justify-evenly gap-6">
          <TenantDashboardCard
            title="My Requests"
            icon={<TenantRequest width={85} height={85} />}
            onPress={() => router.push('/tenants/requests/tenant')}
          />
          <TenantDashboardCard
            title="Bookings"
            icon={<PropertySetting width={85} height={85} />}
            onPress={() => router.push('/bookings/tenant')}
          />
          <TenantDashboardCard
            title="Invoices"
            icon={<InvoicePayment width={85} height={85} />}
            onPress={() => router.push('/invoices/tenant')}
          />
        </View>
      </View>
    </ScrollView>
  );
}
