import  { useEffect, useState, useContext } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/Firebase';
import { UserContext } from '../../context/UserContext';

const AttendanceChart = () => {
  const { user } = useContext(UserContext);
  const [attendanceData, setAttendanceData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatMonth = (date) => date.toISOString().slice(0, 7);
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const goToPreviousMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const goToNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user) return;
      const docRef = doc(db, 'attendance', user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data().records || {};
        setAttendanceData(data);
      }
    };

    fetchAttendance();
  }, [user]);

  const monthPrefix = formatMonth(currentMonth);
  const today = getTodayDate();
  const todayStatus = attendanceData[today] || 'Not Marked';

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = (i + 1).toString().padStart(2, '0');
    const date = `${monthPrefix}-${day}`;
    return { date, status: attendanceData[date] || 'Not Marked' };
  });

return (
  <div className="min-h-screen pt-20 bg-gradient-to-b from-black via-gray-950 to-purple-950 text-white px-6">


    {/* ===== Page Heading ===== */}
    <h1 className="text-2xl md:text-3xl font-bold text-center text-purple-400 mb-6 tracking-wide">
      Attendance Dashboard
    </h1>

{/* ===== Today's Attendance ===== */}
<div className="max-w-3xl mx-auto mb-6 bg-gray-900/70 border border-purple-700 rounded-xl p-4 shadow-md">
  <div className="flex justify-between items-center text-sm">
    
    <div>
      <p className="text-purple-300 font-semibold">
        Today's Attendance
      </p>
      <p className="text-gray-400 text-xs mt-1">
        {today}
      </p>
    </div>

    <span className="font-semibold text-sm">
      {todayStatus === "Present" && (
        <span className="text-green-400">Present</span>
      )}
      {todayStatus === "Absent" && (
        <span className="text-red-400">Absent</span>
      )}
      {todayStatus === "Not Marked" && (
        <span className="text-yellow-400">Not Marked</span>
      )}
    </span>

  </div>
</div>


    {/* ===== Month Navigation ===== */}
    <div className="flex justify-center items-center gap-6 mb-6">
      <button
        onClick={goToPreviousMonth}
        className="w-10 h-10 flex items-center justify-center bg-purple-700/70 hover:bg-purple-700 rounded-full transition text-xl font-bold"
      >
        ←
      </button>

      <span className="text-base font-semibold text-purple-300 tracking-wide">
        {currentMonth.toLocaleString("default", { month: "long" })}{" "}
        {currentMonth.getFullYear()}
      </span>

      <button
        onClick={goToNextMonth}
        className="w-10 h-10 flex items-center justify-center bg-purple-700/70 hover:bg-purple-700 rounded-full transition text-xl font-bold"
      >
        →
      </button>
    </div>

    {/* ===== Compact Calendar ===== */}
    <div className="max-w-3xl mx-auto bg-gray-900/70 border border-purple-800 rounded-xl p-4 shadow-lg">

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center mb-3 text-xs font-semibold text-purple-300">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">

        {/* Empty spaces */}
        {Array.from({
          length: new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
          ).getDay(),
        }).map((_, index) => (
          <div key={"empty-" + index}></div>
        ))}

        {dailyData.map(({ date, status }) => {
          const dayNumber = date.split("-")[2];
          const isToday = date === today;

          return (
            <div
              key={date}
              className={`h-14 w-14 mx-auto bg-gray-800/60 rounded-md p-1 flex flex-col justify-between
              hover:bg-gray-800 transition border
              ${
                isToday
                  ? "border-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.5)]"
                  : "border-gray-700"
              }`}
            >
              {/* Day Number */}
              <span className="text-[11px] text-gray-300">
                {dayNumber}
              </span>

              {/* Status Dot */}
              <div className="flex justify-end">
                {status === "Present" && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
                {status === "Absent" && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
                {status === "Not Marked" && (
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                )}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  </div>
);

};

export default AttendanceChart;