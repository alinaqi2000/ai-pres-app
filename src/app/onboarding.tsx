import { useRouter } from 'expo-router';
import React from 'react';

import { Cover } from '@/components/cover';
import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';
export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center justify-center">
      <FocusAwareStatusBar />
      <View className="w-full flex-1">
        <Cover />
      </View>
      <View className="justify-end">
        <Text className="my-3 text-center text-5xl font-bold">AI PRES</Text>
        <Text className="mb-2 text-center text-lg text-gray-600">
          Smarter property management at your fingertips
        </Text>

        <Text className="my-1 pt-6 text-left text-lg">
          🏢 Manage properties, floors & units easily
        </Text>
        <Text className="my-1 text-left text-lg">
          👥 Seamless tenant management & rent tracking
        </Text>
        <Text className="my-1 text-left text-lg">
          🤖 AI-powered rent evaluation & suggestions
        </Text>
        <Text className="my-1 text-left text-lg">
          📊 Instant reports on rent, expenses & profit
        </Text>
        <Text className="my-1 text-left text-lg">
          💬 Get instant support with our AI chatbot
        </Text>
      </View>
      <SafeAreaView className="mt-6">
        <Button
          label="Start Managing Now"
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/login');
          }}
        />
      </SafeAreaView>
    </View>
  );
}
