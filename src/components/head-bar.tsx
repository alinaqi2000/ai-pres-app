import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';

import { ArrowBack } from '@/components/ui/icons';
import { Text } from '@/components/ui/text';

import { FocusAwareStatusBar } from './ui';

export default function HeadBar({
  title,
  right,
  withBackButton = true,
}: {
  title: string;
  right?: React.ReactNode;
  withBackButton?: boolean;
}) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  return (
    <>
      <FocusAwareStatusBar />

      <View className="mx-4 mt-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          {withBackButton !== false && (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowBack
                fill={colorScheme === 'dark' ? '#ffffff' : '#000000'}
                width={24}
                height={24}
              />
            </TouchableOpacity>
          )}
          <Text className="text-xl font-bold">{title}</Text>
        </View>
        {right}
      </View>
    </>
  );
}
