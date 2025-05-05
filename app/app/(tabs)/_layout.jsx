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
<<<<<<< HEAD
        headerShown: false,
        tabBarStyle: { display: "none" },
=======
        headerRight: () => {
          return <Button title="Sign out" onPress={signOut} />;
        },
>>>>>>> 732bf8d00eb2edb80ea9fd5b6e11eebf6142c207
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="parentdashboard" options={{ title: "Dashboard" }} />
    </Tabs>
  );
}
