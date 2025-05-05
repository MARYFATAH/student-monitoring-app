import { Tabs, Redirect } from "expo-router";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Button } from "react-native";

export default function TabLayout() {
  const { isSignedIn, isLoaded } = useUser();
  const { signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/auth/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="parentdashboard" options={{ title: "Dashboard" }} />
    </Tabs>
  );
}
