import { useEffect, useState, createContext } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

export const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { user } = useUser(); // Clerk user data
  const { getToken } = useAuth(); // Clerk token function
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!user) return; // Exit if no user

        const token = await getToken(); // Fetch authentication token

        // Check the user's role and fetch the appropriate profile
        if (user.publicMetadata?.role === "teacher") {
          const response = await fetch(`/localhost:3000/users/${user.id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) throw new Error("Failed to fetch teacher profile");
          const data = await response.json();
          setProfile(data);
        } else if (user.publicMetadata?.role === "parent") {
          const response = await fetch(`/localhost:3000/users/${user.id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) throw new Error("Failed to fetch parent profile");
          const data = await response.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, getToken]);

  return (
    <ProfileContext.Provider value={{ profile, loading, error, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
