// import React from "react";

// export function Login() {
//   return (
//     <div className="h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
//           Login
//         </h1>
//         <form className="space-y-4">
//           {/* Username Input */}
//           <div>
//             <label
//               htmlFor="username"
//               className="block text-gray-600 font-medium mb-1"
//             >
//               Username
//             </label>
//             <input
//               type="text"
//               id="username"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your username"
//             />
//           </div>

//           {/* Password Input */}
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-gray-600 font-medium mb-1"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your password"
//             />
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
//           >
//             Login
//           </button>
//         </form>

//         {/* Footer Links */}
//         <div className="text-center mt-4">
//           <p className="text-sm text-gray-500">
//             Forgot your password?{" "}
//             <a href="/recover" className="text-blue-600 hover:underline">
//               Recover Account
//             </a>
//           </p>
//           <p className="text-sm text-gray-500">
//             Don't have an account?{" "}
//             <a href="/signup" className="text-blue-600 hover:underline">
//               Sign Up
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

export function Login() {
  return (
    <header className="h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-white mb-4 text-center">
        Welcome to the Student Management System
      </h1>
      <SignedOut className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <SignInButton className="bg-white text-blue-600 hover:bg-gray-200 font-bold py-2 px-6 rounded-lg transition-colors duration-300" />
      </SignedOut>
      <SignedIn className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          Welcome back!
        </h1>
        <UserButton className="bg-white text-blue-600 hover:bg-gray-200 font-bold py-2 px-6 rounded-lg transition-colors duration-300" />
      </SignedIn>
    </header>
  );
}
