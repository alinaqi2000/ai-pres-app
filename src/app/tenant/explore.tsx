import React from 'react';
import { View } from 'react-native';

import Feed from '@/components/explore/feed';
import { FocusAwareStatusBar } from '@/components/ui';

export default function Explore() {
  return (
    <View className="flex-1">
      <FocusAwareStatusBar />
      <Feed />
    </View>
  );
}
