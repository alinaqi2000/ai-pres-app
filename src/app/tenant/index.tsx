import React from 'react';
import { View } from 'react-native';

import { TenantDashboard } from '@/components/dashboard';
import { FocusAwareStatusBar } from '@/components/ui';

export default function OwnerHome() {
  return (
    <View className="flex-1">
      <FocusAwareStatusBar />
      <TenantDashboard />
    </View>
  );
}
