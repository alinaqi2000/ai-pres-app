import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Image, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';

import { Logo } from '../logo';

export const SelectRoleForm = () => {
  const setRole = useAuth.use.setRole();

  const router = useRouter();
  return (
    <View className="flex-1 justify-center p-4">
      <View className="items-center justify-center">
        <Logo />
        <Text
          testID="form-title"
          className="pb-6 text-center text-xl font-bold"
        >
          Select a role to continue
        </Text>
        <View className="mt-10 flex-row items-center justify-center gap-12">
          <TouchableOpacity
            onPress={() => {
              setRole('owner');
              router.replace('/owner');
            }}
          >
            <View className="flex-col items-center gap-3 rounded-lg px-9 py-7 shadow-lg dark:shadow-gray-800/50">
              <Image
                className="size-20"
                placeholder="Landlord"
                contentFit="contain"
                source={require('@/../assets/icons/home.svg')}
              />
              <Text className="text-lg font-bold">Owner</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setRole('tenant');
              router.replace('/');
            }}
          >
            <View className="flex-col items-center gap-3 rounded-lg px-9 py-7 shadow-lg dark:shadow-gray-800/50">
              <Image
                className="size-20"
                placeholder="Tenant"
                contentFit="contain"
                source={require('@/../assets/icons/people.svg')}
              />
              <Text className="text-lg font-bold">Tenant</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => router.replace('/admin')}>
              <View className="flex-row items-center gap-2 rounded-lg px-9 pyx-8 py-6 shadow-lg dark:shadow-gray-800/50">
                <Image
                  className="size-6"
                  source={require('@/../assets/icons/home.svg')}
                />
                <Text>Admin</Text>
              </View>
            </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};
