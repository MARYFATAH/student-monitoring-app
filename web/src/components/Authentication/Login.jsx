import React, { useContext, useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../Context/ProfileContext.js";

export function Login() {
  const { profile, loading, error } = useContext(ProfileContext);
  const navigate = useNavigate();

  // Handle redirection based on role after login
  useEffect(() => {
    if (loading || error) return; // Wait for profile to load or handle errors
    if (!profile) return; // If no profile, do nothing
    // console.debug("Profile:", profile);
    //   {
    //     "user_id": "user_2vlZdvA4w0gbX9w4oFdRkTaGghC",
    //     "phone_number": null,
    //     "address": null,
    //     "first_name": "Sascha",
    //     "dob": null,
    //     "email": null,
    //   >>>>>>>>>>>>>>>  "role": "teacher", <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //     "created_at": "2025-04-16T08:12:04.621Z"
    // }
    if (profile.role === "teacher") {
      navigate("/teacherdashboard");
    } else if (profile.role === "parent" || profile.role === "student") {
      navigate("/parentdashboard");
    }
  }, [profile, loading, error, navigate]);

  return (
    <header className="h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-white mb-4 text-center">
        Welcome to the Student Management System
      </h1>

      {/* Signed Out View */}
      <SignedOut>
        <SignInButton className="bg-white text-blue-600 hover:bg-gray-200 font-bold py-2 px-6 rounded-lg transition-colors duration-300" />
      </SignedOut>

      {/* Signed In View */}
      <SignedIn>
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          Welcome back!
        </h1>
        <UserButton className="bg-white text-blue-600 hover:bg-gray-200 font-bold py-2 px-6 rounded-lg transition-colors duration-300" />
      </SignedIn>
    </header>
  );
}
