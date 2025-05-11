import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-paper';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  icon: string;
  count?: number;
  onPress?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  // eslint-disable-next-line unused-imports/no-unused-vars
  icon,
  count,
  onPress,
}) => (
  <Card style={styles.card}>
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Text className="text-xl font-bold">{title}</Text>
        {count !== undefined && (
          <Text className="text-xl font-bold">{count}</Text>
        )}
      </View>
      <Button onPress={onPress} style={styles.cardButton}>
        <Text className="text-xl font-bold">View Details</Text>
      </Button>
    </View>
  </Card>
);

// eslint-disable-next-line max-lines-per-function
export function OwnerDashboard() {
  return (
    <ScrollView style={styles.container}>
      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <View style={styles.greetingContent}>
          <Avatar.Text size={48} label="O" />
          <View>
            <Text
              className="text-2xl font-bold text-gray-900 dark:text-gray-100"
              style={styles.greetingText}
            >
              Good Morning!
            </Text>
            <Text className="text-gray-500 dark:text-gray-400">
              Welcome back, Owner
            </Text>
          </View>
        </View>
      </View>
      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Quick Actions
        </Text>
        <View style={styles.cardsContainer}>
          <DashboardCard
            title="Manage Properties"
            icon="🏠"
            count={5}
            onPress={() => { }}
          />
          <DashboardCard
            title="Tenant Requests"
            icon="📨"
            count={3}
            onPress={() => { }}
          />
          <DashboardCard
            title="Manage Tenants"
            icon="👥"
            count={12}
            onPress={() => { }}
          />
          <DashboardCard
            title="Expenses"
            icon="💰"
            count={8}
            onPress={() => { }}
          />
        </View>
      </View>
      {/* Recent Activity */}
      <View style={styles.recentActivityContainer}>
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Recent Activity
        </Text>
        <Card style={styles.activityCard}>
          <Text style={styles.activityText}>
            Check your latest property updates and tenant interactions
          </Text>
        </Card>
      </View>
      {/* Financial Overview */}
      <View style={styles.financialContainer}>
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Financial Overview
        </Text>
        <Card style={styles.financialCard}>
          <View style={styles.financialContent}>
            <Text style={styles.financialAmount}>$12,500</Text>
            <Text style={styles.financialGrowth}>+15% from last month</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  greetingContainer: {
    marginBottom: 24,
  },
  greetingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeText: {
    // color: colors.charcoal[50],
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardsContainer: {
    flexWrap: 'wrap',
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    gap: 1,
  },
  card: {
    flex: 1,
    minWidth: '40%',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardButton: {
    width: '100%',
  },
  recentActivityContainer: {
    marginBottom: 24,
  },
  activityCard: {
    padding: 16,
  },
  activityText: {
    // color: colors.charcoal[50],
  },
  financialContainer: {},
  financialCard: {
    padding: 16,
  },
  financialContent: {
    alignItems: 'center',
  },
  financialAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    // color: colors.charcoal[50],
  },
  financialGrowth: {
    // color: colors.charcoal[50],
    marginTop: 8,
  },
});
