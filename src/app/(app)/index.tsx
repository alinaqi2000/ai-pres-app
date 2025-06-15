/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { SelectRoleForm } from '@/components/auth/select-role';
import { FocusAwareStatusBar, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { useIsFirstTime } from '@/lib';

export default function SelectRole() {
  const status = useAuth.use.status();
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
    <View className="flex-1">
      <FocusAwareStatusBar />
      <SelectRoleForm />
    </View>
  );
}
