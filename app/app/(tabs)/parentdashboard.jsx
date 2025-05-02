import React, { useState, useEffect, useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import { ProfileContext } from "../../context/ProfileContext";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const API_HOST = process.env.EXPO_PUBLIC_API_HOST;

function HomeworkScreen() {
  const { getToken } = useAuth();
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <View style={styles.container}>
      <Text style={styles.title}>Homework</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#7C3AED" />
      ) : error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : (
        <FlatList
          data={homework}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {item.name || "Homework Name"}
              </Text>
              <Text style={styles.text}>
                Due Date: {new Date(item.due_date).toLocaleDateString()}
              </Text>
              <Text style={styles.text}>
                Subject: {item.subject || "Not specified"}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

function ScoresScreen() {
  const { profile } = useContext(ProfileContext);
  const { getToken } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  function EventsScreen() {}

  return (
    <View style={styles.container}>
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
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {item.assignment_name || "Assignment Name"}
              </Text>
              <Text style={styles.text}>Score: {item.score}</Text>
              <Text style={styles.text}>
                Student ID: {item.student_id || "Unknown"}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

export default function ParentDashboard() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Homework") {
            iconName = "book";
          } else if (route.name === "Scores") {
            iconName = "stats-chart";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Homework" component={HomeworkScreen} />
      <Tab.Screen name="Scores" component={ScoresScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F3E8FF" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6D28D9",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#7C3AED" },
  text: { fontSize: 14, color: "#4A4A4A", marginTop: 5 },
  error: { fontSize: 16, color: "red", textAlign: "center", marginTop: 10 },
});
