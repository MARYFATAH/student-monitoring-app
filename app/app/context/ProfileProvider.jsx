import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { ProfileContext } from "./ProfileContext.js";

const API_HOST = process.env.EXPO_PUBLIC_API_HOST;

export function ProfileProvider({ children }) {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        console.log("Auth Token:", token); // Debugging Line
        console.log(`${API_HOST}/users/my-profile`);

        const response = await fetch(`${API_HOST}/users/my-profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Profile Data:", data); // Debugging Line
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
}
