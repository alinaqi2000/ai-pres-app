import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RefreshControl } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { useOwnerReports } from '@/api/shared/use-shared';
import { Card } from '@/components/ui/card';
import { InvoicePayment, PaymentRequests } from '@/components/ui/icons';
import { formatCurrency } from '@/lib/utils';

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
  const { data: ownerReports, isLoading, refetch } = useOwnerReports();

  return (
    <ScrollView
      className="flex-1 px-4"
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <HeaderBar title="Finance" withBackButton={false} />
      {/* Financial Overview */}
      {isLoading ? (
        <View className="my-6 items-center justify-center py-8">
          <Text className="text-gray-500 dark:text-gray-400">
            Loading financial data...
          </Text>
        </View>
      ) : ownerReports ? (
        <View className="my-6 px-3">
          {/* Summary Cards */}
          <View className="mb-6 flex-row flex-wrap justify-between gap-4">
            <Card className="flex-1 overflow-hidden rounded-xl border-2 border-primary-100/25 bg-white shadow-sm dark:bg-charcoal-900">
              <View className="p-4">
                <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Payments
                </Text>
                <Text className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(
                    ownerReports.payment_stats.total_received || 0
                  )}
                </Text>
                <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Upcoming:{' '}
                  {formatCurrency(ownerReports.payment_stats.total_upcoming)}
                </Text>
              </View>
            </Card>

            <Card className="flex-1 overflow-hidden rounded-xl border-2 border-primary-100/25 bg-white shadow-sm dark:bg-charcoal-900">
              <View className="p-4">
                <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Invoice Status
                </Text>
                <Text className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {ownerReports.invoice_stats.total_paid}
                </Text>
                <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Overdue: {ownerReports.invoice_stats.total_overdue}
                </Text>
              </View>
            </Card>
          </View>

          {/* Booking Stats */}
          <Card className="mb-6 overflow-hidden rounded-xl border-2 border-primary-100/25 bg-white shadow-sm dark:bg-charcoal-900">
            <View className="p-4">
              <Text className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-100">
                Booking Statistics
              </Text>
              <View className="flex-row items-center justify-around py-2">
                <BookingStatCircle
                  title="Active"
                  count={ownerReports.booking_stats.active}
                  total={ownerReports.booking_stats.total}
                  color="#22c55e"
                />
                <BookingStatCircle
                  title="Closed"
                  count={ownerReports.booking_stats.closed}
                  total={ownerReports.booking_stats.total}
                  color="#6366f1"
                />
              </View>
            </View>
          </Card>

          <View className="mb-8 mt-4 items-center">
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              Last updated:{' '}
              {new Date(ownerReports.generated_at).toLocaleString()}
            </Text>
          </View>
        </View>
      ) : (
        <View className="my-6 items-center justify-center py-8">
          <Text className="text-gray-500 dark:text-gray-400">
            No financial data available
          </Text>
        </View>
      )}
      {/* Quick Actions */}
      <View className="my-6">
        <View className="flex-row flex-wrap justify-evenly gap-6">
          <OwnerFinanceCard
            title="Invoices"
            icon={<InvoicePayment width={80} height={80} />}
            onPress={() => router.push('/invoices/owner')}
          />
          <OwnerFinanceCard
            title="Tenant Payments"
            icon={<PaymentRequests width={80} height={80} />}
            onPress={() => router.push('/payments/owner')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export interface BookingStatCircleProps {
  title: string;
  count: number;
  total: number;
  color: string;
  showPercentage?: boolean;
}

export const BookingStatCircle: React.FC<BookingStatCircleProps> = ({
  title,
  count,
  total,
  color,
  showPercentage = true,
}) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <View className="items-center">
      <AnimatedCircularProgress
        size={80}
        width={8}
        fill={percentage}
        tintColor={color}
        backgroundColor="#e5e7eb"
        rotation={0}
      >
        {() => (
          <Text className="text-lg font-bold" style={{ color }}>
            {count}
          </Text>
        )}
      </AnimatedCircularProgress>
      <Text className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {title}
      </Text>
      {showPercentage && (
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {percentage}%
        </Text>
      )}
    </View>
  );
};
