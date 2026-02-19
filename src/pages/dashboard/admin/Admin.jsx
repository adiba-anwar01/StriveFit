import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, db } from "../../../config/Firebase";
import { FaUsers, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split("T")[0];

const Admin = () => {
  // State to store users list and attendance records
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const today = getTodayDate();

  useEffect(() => {
    // Fetch all users except admin
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => user.role !== "admin");
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Fetch attendance records for all users
    const fetchAllAttendance = async () => {
      try {
        const userAttendance = {};
        const querySnapshot = await getDocs(collection(db, "attendance"));
        querySnapshot.forEach((docSnap) => {
          userAttendance[docSnap.id] = docSnap.data()?.records || {};
        });
        setAttendance(userAttendance);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchUsers();
    fetchAllAttendance();
  }, []);

  // Function to mark attendance for a specific user
  const markAttendance = async (userId, status) => {
    try {
      const userRecord = attendance[userId] || {};
      const updatedUserAttendance = { ...userRecord, [today]: status };

      // Update local state immediately (optimistic update)
      setAttendance((prev) => ({ ...prev, [userId]: updatedUserAttendance }));

      // Save to Firestore
      await setDoc(
        doc(db, "attendance", userId),
        { records: updatedUserAttendance },
        { merge: true },
      );
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  // ===== Dashboard Summary Calculations =====
  const totalUsers = users.length;
  const totalPresent = users.filter(
    (u) => attendance[u.id]?.[today] === "Present",
  ).length;
  const totalAbsent = users.filter(
    (u) => attendance[u.id]?.[today] === "Absent",
  ).length;

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-b from-[#18181F] via-[#1c1330] to-[#1e0f38] text-white p-6 sm:p-10">
      {/* ===== Header ===== */}
      <h1 className="text-3xl sm:text-4xl text-center text-[#C4B5FD] font-extrabold mb-8">
        Admin Panel - Daily Attendance
      </h1>

      {/* ===== Summary Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-[#7C3AED]/50 to-[#C4B5FD]/20 rounded-xl p-5 shadow-md flex items-center gap-3 hover:shadow-[#7C3AED]/60 transition">
          <FaUsers className="text-[#C4B5FD] w-8 h-8" />
          <div>
            <p className="text-gray-300 text-sm">Total Users</p>
            <p className="text-xl font-bold">{totalUsers}</p>
          </div>
        </div>

        {/* Present Count */}
        <div className="bg-gradient-to-r from-green-600/40 to-green-400/20 rounded-xl p-5 shadow-md flex items-center gap-3 hover:shadow-green-400/50 transition">
          <FaCheckCircle className="text-green-400 w-8 h-8" />
          <div>
            <p className="text-gray-300 text-sm">Present Today</p>
            <p className="text-xl font-bold">{totalPresent}</p>
          </div>
        </div>

        {/* Absent Count */}
        <div className="bg-gradient-to-r from-red-600/40 to-red-400/20 rounded-xl p-5 shadow-md flex items-center gap-3 hover:shadow-red-400/50 transition">
          <FaTimesCircle className="text-red-500 w-8 h-8" />
          <div>
            <p className="text-gray-300 text-sm">Absent Today</p>
            <p className="text-xl font-bold">{totalAbsent}</p>
          </div>
        </div>
      </div>

      {/* ===== User Attendance Grid ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {users.map((user) => {
          const userAttendance = attendance[user.id] || {};
          const status = userAttendance[today] || null;

          return (
            <div
              key={user.id}
              className="bg-[#1f1330]/70 p-5 rounded-2xl shadow-md hover:shadow-[#7C3AED]/50 transition flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
            >
              {/* User Information */}
              <div className="flex-1">
                <p className="text-lg font-semibold break-words">
                  {user.name || "No Name"}
                </p>
                <p className="text-sm text-[#C4B5FD] break-words">
                  {user.email || user.id}
                </p>

                {/* Current Attendance Status */}
                <p className="mt-2 text-sm">
                  Status:{" "}
                  <span
                    className={`font-semibold px-2 py-1 rounded-full text-sm ${
                      status === "Present"
                        ? "bg-green-500/30 text-green-400"
                        : status === "Absent"
                          ? "bg-red-500/30 text-red-400"
                          : "bg-gray-600/30 text-gray-400"
                    }`}
                  >
                    {status || "Not Marked"}
                  </span>
                </p>
              </div>

              {/* Attendance Action Buttons */}
              <div className="flex flex-wrap gap-3 sm:flex-col sm:items-end mt-3 sm:mt-0">
                <button
                  onClick={() => markAttendance(user.id, "Present")}
                  className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-full text-sm font-semibold transform hover:scale-105 transition"
                >
                  ✅ Present
                </button>
                <button
                  onClick={() => markAttendance(user.id, "Absent")}
                  className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-full text-sm font-semibold transform hover:scale-105 transition"
                >
                  ❌ Absent
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Admin;
