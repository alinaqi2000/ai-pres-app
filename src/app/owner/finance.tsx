import React from 'react';

import { OwnerFinance } from '@/components/dashboard/owner-finance';
import { FocusAwareStatusBar, View } from '@/components/ui';

export default function Finance() {
  return (
    <View className="flex-1">
      <FocusAwareStatusBar />
      <OwnerFinance />
    </View>
  );
}
