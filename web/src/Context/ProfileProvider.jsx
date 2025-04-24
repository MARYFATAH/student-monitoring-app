import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { ProfileContext } from "./ProfileContext.js";

export function ProfileProvider({ children }) {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();

        const response = await fetch(`http://localhost:3000/users/my-profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [getToken]);

  return (
    <ProfileContext.Provider value={{ profile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
}
