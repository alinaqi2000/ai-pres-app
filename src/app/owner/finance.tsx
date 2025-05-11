import React from 'react';
import { Text, View } from 'react-native';

import { FocusAwareStatusBar } from '@/components/ui';

export default function Finance() {
  return (
    <View className="flex-1">
      <FocusAwareStatusBar />
      <Text>Finance</Text>
    </View>
  );
}
