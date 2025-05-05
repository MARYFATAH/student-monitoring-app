import React, { useState, useEffect, useContext, useRef } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { ProfileContext } from "../../context/ProfileContext";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createMaterialTopTabNavigator();
const API_HOST = process.env.EXPO_PUBLIC_API_HOST;

// 📌 **Animated Profile Screen**
function ProfileScreen() {
  const { profile } = useContext(ProfileContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Profile</Text>
      {profile ? (
        <View style={styles.profileCard}>
          <Text style={styles.profileText}>
            Name: {profile.first_name} {profile.last_name}
          </Text>
          <Text style={styles.profileText}>Email: {profile.email}</Text>
          <Text style={styles.profileText}>
            Phone: {profile.phone_number || "N/A"}
          </Text>
          <Text style={styles.profileText}>
            Address: {profile.address || "N/A"}
          </Text>
        </View>
      ) : (
        <Text style={styles.error}>Profile not available</Text>
      )}
    </Animated.View>
  );
}

// 📌 **Animated Homework Screen**
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
                  Subject: {item.subject || "Not specified"}
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

// 📌 **Animated Scores Screen**
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
                <Text style={styles.text}>Score: {item.score}</Text>
                <Text style={styles.text}>
                  Student ID: {item.student_id || "Unknown"}
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
    backgroundColor: "#4F46E5", // Dark blue-violet background
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#E0E7FF", // Soft pastel contrast
    marginBottom: 15,
    textAlign: "center",
    letterSpacing: 1,
  },

  profileCard: {
    backgroundColor: "#4338CA", // Slightly lighter purple for depth
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    alignItems: "start",
    marginBottom: 15,
  },

  profileText: {
    fontSize: 18,
    color: "#E0E7FF", // Light pastel for visibility
    marginBottom: 10,
    fontWeight: "500",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#d6d5ff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },

  cardHeader: {
    backgroundColor: "#3730A3",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  cardTitle: {
    color: "#F9FAFB", // Soft white for readability
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  cardContent: { padding: 12 },

  text: {
    fontSize: 16,
    color: "#3730A3", // Light pastel for smooth contrast
    marginTop: 6,
    fontWeight: "500",
  },

  error: {
    fontSize: 18,
    color: "#EF4444", // Bright red for clear alert visibility
    textAlign: "center",
    marginTop: 12,
    fontWeight: "bold",
  },

  noData: {
    textAlign: "center",
    color: "#D1D5DB", // Muted grayish-white for elegance
    fontSize: 18,
    marginTop: 12,
    fontStyle: "italic",
  },
});
