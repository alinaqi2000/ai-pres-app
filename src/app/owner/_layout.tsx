/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { Avatar } from 'react-native-paper';

import { colors } from '@/components/ui';
import {
  Dashboard as DashboardIcon,
  Finance as FinanceIcon,
} from '@/components/ui/icons';
import { useAuth, useIsFirstTime } from '@/lib';

export default function TabLayout() {
  const status = useAuth.use.status();
  const user = useAuth.use.user();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color }) => <DashboardIcon color={color} />,
          tabBarButtonTestID: 'dashboard-tab',
        }}
      />

      <Tabs.Screen
        name="finance"
        options={{
          title: 'Finance',
          headerShown: false,
          tabBarIcon: ({ color }) => <FinanceIcon color={color} />,
          tabBarButtonTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          // eslint-disable-next-line unused-imports/no-unused-vars
          tabBarIcon: ({ color }) => (
            <Avatar.Text
              style={{ backgroundColor: colors.primary[200] }}
              labelStyle={{
                color: colors.primary[900],
              }}
              label={user?.name?.[0] || 'S'}
              size={24}
            />
          ),
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}
