import { FlashList as NFlashList } from '@shopify/flash-list';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Button } from 'react-native-paper';

import { NoDataIcon } from './icons';
import { Text } from './text';
type Props = {
  isLoading: boolean;
  retry?: () => void;
};

export const List = NFlashList;

export const EmptyList = React.memo(({ isLoading, retry }: Props) => {
  const { colorScheme } = useColorScheme();
  return (
    <View className="min-h-[400px] flex-1 items-center justify-center">
      {!isLoading ? (
        <View className="flex-col items-center justify-center gap-8">
          <NoDataIcon width={200} height={200} />
          <Text>Sorry! No data found</Text>
          {retry && (
            <Button
              icon="refresh"
              onPress={retry}
              theme={{
                colors: {
                  primary: colorScheme === 'dark' ? '#fff' : '#000',
                },
              }}
            >
              Retry
            </Button>
          )}
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
});
