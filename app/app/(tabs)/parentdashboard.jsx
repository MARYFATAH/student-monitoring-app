import React, { useState, useEffect, useContext, useRef } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import aminPic from "../../assets/images/aminpic.jpg";

import {
  Image,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Button,
  Pressable,
} from "react-native";
import { ProfileContext } from "../../context/ProfileContext";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
const Tab = createMaterialTopTabNavigator();
const API_HOST = process.env.EXPO_PUBLIC_API_HOST;

// 📌 **Animated Profile Screen**
function ProfileScreen() {
  const { profile } = useContext(ProfileContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { signOut } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Student's Picture - Now centered above */}
      <Text style={styles.title}>{profile.first_name}'s Profile</Text>
      <Image source={aminPic} style={styles.kidImage} />

      {profile ? (
        <View style={styles.profileCard}>
          <Text style={styles.profileText}>
            <Text style={{ fontWeight: "bold" }}> Name: </Text>
            {profile.first_name} {profile.last_name}
          </Text>
          <Text style={styles.profileText}>
            <Text style={{ fontWeight: "bold" }}> Email: </Text>
            {profile.email}
          </Text>
          <Text style={styles.profileText}>
            <Text style={{ fontWeight: "bold" }}> Phone Number: </Text>{" "}
            {profile.phone_number || "N/A"}
          </Text>
          <Text style={styles.profileText}>
            <Text style={{ fontWeight: "bold" }}> Address: </Text>{" "}
            {profile.address || "N/A"}
          </Text>
        </View>
      ) : (
        <Text style={styles.error}>Profile not available</Text>
      )}

      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </Animated.View>
  );
}

// **Animated Homework Screen**
function HomeworkScreen() {
  const { getToken } = useAuth();
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchHomework = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await fetch(
          `${API_HOST}/assignments?assignment_type=homework`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok)
          throw new Error(`HTTP Error! Status: ${response.status}`);
        const data = await response.json();
        setHomework(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHomework();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Homework</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#7C3AED" />
      ) : error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : homework.length > 0 ? (
        <FlatList
          data={homework}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {item.name || "Homework Name"}
                </Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.text}>
                  Subject: {item.description || "Not specified"}
                </Text>
                <Text style={styles.text}>
                  Due Date: {new Date(item.due_date).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noData}>No homework found.</Text>
      )}
    </Animated.View>
  );
}

// **Animated Scores Screen**
function ScoresScreen() {
  const { profile } = useContext(ProfileContext);
  const { getToken } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await fetch(`${API_HOST}/scores`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok)
          throw new Error(`HTTP Error! Status: ${response.status}`);
        const data = await response.json();
        setScores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <Text style={styles.title}>Scores</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#7C3AED" />
      ) : error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : (
        <FlatList
          data={scores.filter((score) => score.student_id === profile?.user_id)}
          keyExtractor={(item) => item.assignment_id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {item.assignment_name || "Assignment Name"}
                </Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.text}>Your Score: {item.score}</Text>
                <Text style={styles.text}>
                  Note:{" "}
                  {item.score <= 2
                    ? "Good Job, Keep up the good work"
                    : "Better luck next time"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </Animated.View>
  );
}

// 📌 **Events Screen with Slide-In Animation**
function EventsScreen() {
  const { getToken } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await fetch(`${API_HOST}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok)
          throw new Error(`HTTP Error! Status: ${response.status}`);
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <Text style={styles.title}>Events</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#7C3AED" />
      ) : error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {item.name || "Event Name"}
                </Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.text}>
                  Location: {item.location || "Not provided"}
                </Text>
                <Text style={styles.text}>
                  Date: {new Date(item.event_date).toLocaleDateString()}
                </Text>
                {item.start_time && (
                  <Text style={styles.text}>Time: {item.start_time}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noData}>No events found.</Text>
      )}
    </Animated.View>
  );
}

// 📌 **Final Parent Dashboard with Tabs Above**
export default function ParentDashboard() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarPosition: "top",
        tabBarShowIcon: true,
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "gray",
        tabBarIndicatorStyle: { backgroundColor: "#7C3AED" },
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === "Profile") iconName = "person";
          else if (route.name === "Homework") iconName = "book";
          else if (route.name === "Scores") iconName = "stats-chart";
          else if (route.name === "Events") iconName = "calendar";
          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Homework" component={HomeworkScreen} />
      <Tab.Screen name="Scores" component={ScoresScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#4F46E5",
  },

  title: {
    fontSize: 24,
    fontFamily: "Nunito",
    fontWeight: "bold",
    color: "#E0E7FF",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 1.2,
  },

  profileCard: {
    backgroundColor: "#3F3D9B",
    borderRadius: 10,
    padding: 18,
    marginBottom: 10,
    alignItems: "flex-start",
    flex: 0.5,
    margin: 10,
  },

  profileText: {
    fontSize: 18,
    fontFamily: "Nunito",
    color: "#E0E7FF",
    marginBottom: 8,
  },

  card: {
    backgroundColor: "#D1D5DB",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },

  cardHeader: {
    backgroundColor: "#3730A3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  cardTitle: {
    color: "#F9FAFB",
    fontSize: 20,
    fontFamily: "Nunito",
    fontWeight: "bold",
  },

  cardContent: { padding: 12 },

  button: {
    backgroundColor: "#3730A3",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Nunito",
    fontWeight: "bold",
  },

  text: {
    fontSize: 15,
    fontFamily: "Nunito",
    color: "#3730A3",
    marginTop: 5,
  },

  error: {
    fontSize: 18,
    fontFamily: "Nunito",
    color: "#EF4444",
    textAlign: "center",
  },

  signOutButton: {
    backgroundColor: "#581C87",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  noData: {
    textAlign: "center",
    color: "#D1D5DB",
    fontSize: 18,
    fontFamily: "Nunito",
  },

  kidImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    alignSelf: "center", // Ensures centering above the profile card
    borderWidth: 3,
    borderColor: "#fff",
    marginTop: 15,
  },
});
