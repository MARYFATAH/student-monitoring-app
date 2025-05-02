import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot, Tabs } from "expo-router";
import { ProfileProvider } from "./context/ProfileProvider";
import { TabBarIcon } from "@react-navigation/bottom-tabs";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ProfileProvider>
        <Tabs screenOptions={{ headerShown: false }}>
          <Slot />
        </Tabs>
      </ProfileProvider>
    </ClerkProvider>
  );
}
