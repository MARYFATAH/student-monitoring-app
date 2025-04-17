// import React, { useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ProfileContext } from "../../Context/ProfileProvider";

// const DashboardRedirect = () => {
//   const { profile, loading, error } = useContext(ProfileContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (loading || error) return; // Wait for profile to load or handle errors

//     // Redirect based on user role
//     if (profile?.role === "teacher") {
//       navigate("/teacherdashboard");
//     } else if (profile?.role === "parent") {
//       navigate("/parentdashboard");
//     } else {
//       navigate("/unauthorized"); // Handle unauthorized access or unknown roles
//     }
//   }, [profile, loading, error, navigate]);

//   return <p>Loading...</p>; // Show a loading state while determining redirect
// };

// export default DashboardRedirect;
