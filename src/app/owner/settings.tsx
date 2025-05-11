/* eslint-disable react/react-in-jsx-scope */
import { Env } from '@env';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Avatar, Chip } from 'react-native-paper';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { ThemeItem } from '@/components/settings/theme-item';
import {
  colors,
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { translate, useAuth } from '@/lib';

export default function Settings() {
  const signOut = useAuth.use.signOut();
  const user = useAuth.use.user();
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  // eslint-disable-next-line unused-imports/no-unused-vars
  const iconColor =
    colorScheme === 'dark' ? colors.neutral[400] : colors.neutral[500];
  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView>
        <View className="flex-1 px-4 pt-16 ">
          <View className="mb-10 flex-row items-center justify-between gap-2">
            <View className="flex-row items-center gap-2">
              <Avatar.Text
                style={{ backgroundColor: colors.primary[100] }}
                labelStyle={{
                  color: colors.primary[900],
                  fontWeight: 'bold',
                }}
                label={user?.name?.[0] || 'S'}
                size={36}
              />
              <Text className="text-md ml-1">{user?.name}</Text>
            </View>
            <Chip
              icon="home-switch-outline"
              onPress={() => router.replace('/select-role')}
              style={{ backgroundColor: colors.primary[50] }}
              textStyle={{
                color: colors.primary[900],
                fontSize: 12,
              }}
            >
              Switch Role
            </Chip>
          </View>

          <Text className="text-xl font-bold">
            {translate('settings.title')}
          </Text>
          <ItemsContainer title="settings.generale">
            <ThemeItem />
            <Item
              text="settings.change_password"
              onPress={() => router.push('/settings/change-password')}
            />
          </ItemsContainer>

          <ItemsContainer title="settings.about">
            <Item text="settings.app_name" value={Env.NAME} />
            <Item text="settings.version" value={Env.VERSION} />
          </ItemsContainer>

          <View className="my-8">
            <ItemsContainer>
              <Item text="settings.logout" onPress={signOut} />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
