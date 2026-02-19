import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/Firebase";
import { UserContext } from "../context/UserContext";
import Logo from "../assets/logob.png";
import userLogo from "../assets/user.jpg";
import { motion } from "framer-motion";

// React Icons
import {
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  // =============================
  // Hooks & Context
  // =============================

  const navigate = useNavigate();
  const { user, userData, setUser } = useContext(UserContext);

  // =============================
  // Local State Management
  // =============================

  const [visible, setVisible] = useState(false);        // Mobile drawer visibility
  const [profileOpen, setProfileOpen] = useState(false); // Profile dropdown visibility
  const [loadingRole, setLoadingRole] = useState(true);  // Prevent rendering before role loads

  // =============================
  // Effect: Handle Role Loading
  // =============================

  useEffect(() => {
    if (userData || !user) {
      setLoadingRole(false);
    }
  }, [userData, user]);

  // =============================
  // Logout Handler
  // =============================

  const logoutHandler = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/");
    setVisible(false);
    setProfileOpen(false);
  };

  // =============================
  // Helper: Get User Image
  // =============================

  const getUserImage = () =>
    userData?.photoURL || user?.photoURL || userLogo;

  // =============================
  // Desktop Navigation Renderer
  // =============================

  const renderDesktopLinks = () => {
    if (loadingRole) return null;

    // Guest View
    if (!user) {
      return (
        <>
          <Link to="/" className="hover:text-purple-400 transition">
            Home
          </Link>
          <Link
            to="/login"
            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-white"
          >
            Login
          </Link>
        </>
      );
    }

    // Admin View
    if (userData?.role === "admin") {
      return (
        <>
          <Link
            to="/dashboard/admin"
            className="hover:text-purple-400 font-semibold"
          >
            Admin
          </Link>
          <button
            onClick={logoutHandler}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-white"
          >
            Logout
          </button>
        </>
      );
    }

    // Regular User View
    return (
      <>
        <Link to="/" className="hover:text-purple-400 transition">
          Home
        </Link>
        <Link to="/dashboard/diet" className="hover:text-purple-400 transition">
          Diet
        </Link>
        <Link to="/dashboard/progress" className="hover:text-purple-400 transition">
          Progress
        </Link>
        <Link to="/dashboard/subscription" className="hover:text-purple-400 transition">
          Attendance
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <img
            src={getUserImage()}
            alt="User"
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-purple-600"
          />

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-purple-600/50 rounded shadow-lg py-2">
              
              {/* Profile Button */}
              <button
                onClick={() => {
                  navigate("/dashboard/profile");
                  setProfileOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-purple-600/20 text-left"
              >
                <FaUser /> Profile
              </button>

              {/* Logout Button */}
              <button
                onClick={logoutHandler}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-500/20 text-left text-red-400"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  // =============================
  // Main Render
  // =============================

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full fixed top-0 left-0 z-50 bg-[#18181F] px-4 py-1 shadow-md border-b border-[#7C3AED]/40
 flex items-center justify-between text-white"
    >
      {/* ================= Logo Section ================= */}
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src={Logo} alt="Gym Logo" className="w-12 h-12 object-contain" />
        </Link>
        <Link
          to="/"
          className="text-xl font-bold text-[#C4B5FD]
 hover:text-purple-500 transition"
        >
          StriveFit
        </Link>
      </div>

      {/* ================= Desktop Navigation ================= */}
      <div className="hidden md:flex gap-6 items-center">
        {renderDesktopLinks()}
      </div>

      {/* ================= Mobile Menu Toggle ================= */}
      <div className="md:hidden">
        <button onClick={() => setVisible(true)}>
          <FaBars size={22} />
        </button>
      </div>

      {/* ================= Mobile Drawer ================= */}
      {visible && (
        <div className="fixed inset-0 z-50">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setVisible(false)}
          ></div>

          {/* Drawer Panel */}
          <div className="absolute right-0 top-0 h-full w-72 bg-gray-950 shadow-2xl border-l border-purple-600/40 flex flex-col">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-600/40">
              <h2 className="text-lg font-semibold text-purple-400">
                Menu
              </h2>
              <button onClick={() => setVisible(false)}>
                <FaTimes />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 p-4 space-y-4">

              {!user && (
                <>
                  <button onClick={() => { navigate("/"); setVisible(false); }} className="block w-full text-left">
                    Home
                  </button>
                  <button onClick={() => { navigate("/login"); setVisible(false); }} className="flex items-center gap-2">
                    <FaSignInAlt /> Login
                  </button>
                </>
              )}

              {user && userData?.role === "admin" && (
                <>
                  <button onClick={() => { navigate("/dashboard/admin"); setVisible(false); }} className="block w-full text-left">
                    Admin
                  </button>
                  <button onClick={logoutHandler} className="flex items-center gap-2 text-red-400">
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              )}

              {user && userData?.role === "user" && (
                <>
                  <button onClick={() => { navigate("/"); setVisible(false); }} className="block w-full text-left">
                    Home
                  </button>
                  <button onClick={() => { navigate("/dashboard/diet"); setVisible(false); }} className="block w-full text-left">
                    Diet
                  </button>
                  <button onClick={() => { navigate("/dashboard/progress"); setVisible(false); }} className="block w-full text-left">
                    Progress
                  </button>
                  <button onClick={() => { navigate("/dashboard/subscription"); setVisible(false); }} className="block w-full text-left">
                    Attendance
                  </button>
                  <button onClick={() => { navigate("/dashboard/profile"); setVisible(false); }} className="flex items-center gap-2">
                    <FaUser /> Profile
                  </button>
                  <button onClick={logoutHandler} className="flex items-center gap-2 text-red-400">
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Navbar;
