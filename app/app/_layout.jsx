import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot, Tabs, Stack } from "expo-router";
import { ProfileProvider } from "../context/ProfileProvider";
import { TabBarIcon } from "@react-navigation/bottom-tabs";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ProfileProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="auth/sign-in"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </ProfileProvider>
    </ClerkProvider>
  );
}
