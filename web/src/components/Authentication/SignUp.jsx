import React from "react";
import { Link } from "react-router";

export function SignUp() {
  return (
    <div className="h-screen bg-gradient-to-r from-teal-400 to-blue-500 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Create Your Account
        </h1>
        <form className="space-y-4">
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-gray-600 font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Choose a username"
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-600 font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Create a password"
            />
          </div>

          {/* Sign-Up Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Sign Up
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-600 hover:underline">
              Log In
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            Forgot your password?{" "}
            <Link to="/recover" className="text-teal-600 hover:underline">
              Recover Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
