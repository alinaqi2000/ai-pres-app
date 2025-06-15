import { useColorScheme } from 'nativewind';
import React from 'react';
import { FAB } from 'react-native-paper';

export default function FabButton({ onPress }: { onPress: () => void }) {
  const { colorScheme } = useColorScheme();

  return (
    <FAB
      icon="plus"
      className="absolute bottom-4 right-4 bg-black dark:bg-white"
      color={colorScheme === 'dark' ? '#000000' : '#ffffff'}
      onPress={onPress}
    />
  );
}
