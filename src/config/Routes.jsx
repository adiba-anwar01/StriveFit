// React Router imports
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

// Common layout components
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// Global toast notification
import { Toaster } from "sonner";

// Public pages
import HomePage from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";

// Dashboard pages
import Profile from "../pages/dashboard/Profile.jsx";
import Diet from "../pages/dashboard/Diet.jsx";
import Progress from "../pages/dashboard/Progress.jsx";
import Subscription from "../pages/dashboard/Subscription.jsx";
import Admin from "../pages/dashboard/admin/Admin.jsx";

// Route protection & context
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import { UserContext } from "../context/UserContext";

function AppRouter() {

  // Access logged-in user data from global context
  const { userData } = useContext(UserContext);

  // Redirect admin users away from homepage to admin dashboard
  const UserRoleRedirect = ({ children }) => {
    if (userData?.role === "admin") {
      return <Navigate to="/dashboard/admin" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>

      {/* Global notification system */}
      <Toaster richColors position="top-right" />

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route
          path="/"
          element={
            <UserRoleRedirect>
              <Navbar />
              <HomePage />
              <Footer />
            </UserRoleRedirect>
          }
        />

        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />

        <Route
          path="/signup"
          element={
            <>
              <Navbar />
              <Signup />
            </>
          }
        />

        {/* ================= PROTECTED ROUTES ================= */}

        {/* Admin-only dashboard */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <>
                <Navbar />
                <Admin />
              </>
            </ProtectedRoute>
          }
        />

        {/* Profile page (any logged-in user) */}
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Profile />
              </>
            </ProtectedRoute>
          }
        />

        {/* Diet page */}
        <Route
          path="/dashboard/diet"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Diet />
              </>
            </ProtectedRoute>
          }
        />

        {/* Progress tracking page */}
        <Route
          path="/dashboard/progress"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Progress />
              </>
            </ProtectedRoute>
          }
        />

        {/* Subscription management page */}
        <Route
          path="/dashboard/subscription"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Subscription />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
