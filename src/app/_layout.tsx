// Import  global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { DefaultTheme, PaperProvider } from 'react-native-paper';

import { APIProvider } from '@/api';
import { hydrateAuth, loadSelectedTheme } from '@/lib';
import { useThemeConfig } from '@/lib/use-theme-config';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(app)',
};

loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

export default function RootLayout() {
  React.useEffect(() => {
    const load = async () => {
      await hydrateAuth();
    };
    load();
  }, []);
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(app)/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="properties/manage/create"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="properties/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="properties/manage/upload-property-image"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="properties/manage/manage-floors"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="properties/manage/manage-units"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="properties/manage/create-unit"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="tenants/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="tenants/manage/create"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tenants/booking/create-booking"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tenants/manage/select-item"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tenants/profile/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tenants/booking/detail"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="invoices/detail" options={{ headerShown: false }} />
        <Stack.Screen
          name="bookings/owner/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="bookings/tenant/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="bookings/tenant/create-booking-request"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="invoices/tenant/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="invoices/owner/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="invoices/payment/create"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="payments/detail" options={{ headerShown: false }} />
        <Stack.Screen
          name="payments/owner/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="payments/tenant/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="feed/property/detail"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tenants/requests/tenant"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tenants/requests/owner"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tenants/requests/detail"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="select-role" options={{ headerShown: false }} />
        <Stack.Screen name="owner" options={{ headerShown: false }} />
        <Stack.Screen name="tenant" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings/change-password"
          options={{ headerShown: false }}
        />
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
    >
      <KeyboardProvider>
        <ThemeProvider value={theme}>
          <PaperProvider
            theme={{
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                primary: theme.colors.primary,
                background: theme.colors.background,
                surface: theme.colors.background,
                error: theme.colors.primary,
                onSurface: theme.colors.text,
                backdrop: theme.colors.background,
              },
              dark: theme.dark,
            }}
          >
            <APIProvider>
              <BottomSheetModalProvider>
                {children}
                <FlashMessage position="top" />
              </BottomSheetModalProvider>
            </APIProvider>
          </PaperProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
