// src/HeroPage.native.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

export default function HeroPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const handleStart = () => {
    if (isSignedIn) {
      router.replace("/(tabs)/parentdashboard");
    } else {
      router.push("/auth/sign-in");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Student Monitoring App</Text>
      <Text style={styles.subtitle}>
        Here we can help smooth the education process!
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Let's Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4F46E5", // Example; for a gradient you might use a library or a background image.
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#4F46E5",
    fontWeight: "bold",
  },
});
