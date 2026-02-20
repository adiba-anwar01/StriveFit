import { useEffect, useState, useContext } from 'react';
import {
  db,
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  Timestamp
} from '../../config/Firebase';
import { UserContext } from '../../context/UserContext';
import 'react-circular-progressbar/dist/styles.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Progress = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState([]);
  const [fitnessInput, setFitnessInput] = useState({ age: '', weight: '', chest: '', height: '', bodyFat: '' });
  const [_fitnessScore, setFitnessScore] = useState(null);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ goalName: '', targetValue: '', goalType: 'weight' });
  const [timeframe, _setTimeframe] = useState('all'); 

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const progressQ = query(
          collection(db, 'users', user.uid, 'progressHistory'),
          orderBy('date', 'asc')
        );
        const snapshot = await getDocs(progressQ);
        setProgressData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const fitnessSnap = await getDoc(doc(db, 'fitnessData', user.uid));
        if (fitnessSnap.exists()) {
          const data = fitnessSnap.data();
          setFitnessInput({
            age: data.age?.toString() || '',
            weight: data.weight?.toString() || '',
            chest: data.chest?.toString() || '',
            height: data.height?.toString() || '',
            bodyFat: data.bodyFat?.toString() || ''
          });
          setFitnessScore(data.fitnessScore);
        }

        const goalsSnap = await getDocs(collection(db, 'users', user.uid, 'goals'));
        setGoals(goalsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [user]);

  // Fitness Calculator
  const calculateFitness = async () => {
    const { age, weight, chest, height, bodyFat } = fitnessInput;
    if (!age || !weight || !chest || !height || !bodyFat) return;

    const score = Math.round(((parseInt(weight) + parseInt(chest)) / parseInt(age)) * 5 + parseInt(height) * 0.1 - parseInt(bodyFat) * 0.5);
    setFitnessScore(score);

    const bmi = parseFloat((parseInt(weight) / ((parseInt(height) / 100) ** 2)).toFixed(1));

    try {
      await setDoc(doc(db, 'fitnessData', user.uid), {
        uid: user.uid,
        ...Object.fromEntries(Object.entries(fitnessInput).map(([k, v]) => [k, parseInt(v)])),
        fitnessScore: score
      });

      await addDoc(collection(db, 'users', user.uid, 'progressHistory'), {
        date: Timestamp.now(),
        weight: parseInt(weight),
        chest: parseInt(chest),
        height: parseInt(height),
        bodyFat: parseInt(bodyFat),
        fitnessScore: score,
        bmi,
        notes: ''
      });

      const progressQ = query(
        collection(db, 'users', user.uid, 'progressHistory'),
        orderBy('date', 'asc')
      );
      const snapshot = await getDocs(progressQ);
      setProgressData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    } catch (err) {
      console.error('Error storing progress:', err);
    }
  };

  const deleteProgress = async id => {
    await deleteDoc(doc(db, 'users', user.uid, 'progressHistory', id));
    setProgressData(prev => prev.filter(entry => entry.id !== id));
  };

  const addGoal = async () => {
    if (!newGoal.goalName || !newGoal.targetValue) return;
    const target = Math.abs(parseFloat(newGoal.targetValue)); // Always positive
    const docRef = await addDoc(collection(db, 'users', user.uid, 'goals'), {
      ...newGoal,
      targetValue: target,
      completed: false
    });
    setGoals([...goals, { id: docRef.id, ...newGoal, targetValue: target, completed: false }]);
    setNewGoal({ goalName: '', targetValue: '', goalType: 'weight' });
  };

  const toggleGoal = async (goal) => {
    const docRef = doc(db, 'users', user.uid, 'goals', goal.id);
    await updateDoc(docRef, { completed: !goal.completed });
    setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = async (goal) => {
    await deleteDoc(doc(db, 'users', user.uid, 'goals', goal.id));
    setGoals(prev => prev.filter(g => g.id !== goal.id));
  };

  const filteredProgress = progressData.filter(entry => {
    if (timeframe === 'all') return true;
    const days = parseInt(timeframe);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return entry.date.toDate() >= cutoff;
  });

  const chartData = filteredProgress.map(entry => ({
    date: new Date(entry.date.seconds * 1000).toLocaleDateString(),
    weight: Number(entry.weight),
    fitnessScore: Number(entry.fitnessScore),
    bmi: Number(entry.bmi)
  }));

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-b from-black via-gray-950 to-purple-950 text-white px-6 py-10">

      <h1 className="text-4xl font-bold text-center text-purple-500 mb-10">
        Progress Tracker
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="max-w-7xl mx-auto space-y-12">

          {/* ================= GOALS SECTION ================= */}
          <div className="bg-gray-900 border border-purple-700 p-6 rounded-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">
              Add New Goal
            </h2>

            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder="Goal Name"
                value={newGoal.goalName}
                onChange={e =>
                  setNewGoal({ ...newGoal, goalName: e.target.value })
                }
                className="bg-black border border-purple-600 p-2 rounded w-full sm:w-auto"
              />

              <input
                type="number"
                placeholder="Target"
                value={newGoal.targetValue}
                onChange={e =>
                  setNewGoal({ ...newGoal, targetValue: e.target.value })
                }
                className="bg-black border border-purple-600 p-2 rounded w-full sm:w-32"
              />

              <select
                value={newGoal.goalType}
                onChange={e =>
                  setNewGoal({ ...newGoal, goalType: e.target.value })
                }
                className="bg-black border border-purple-600 p-2 rounded w-full sm:w-auto"
              >
                <option value="weight">Weight</option>
                <option value="steps">Steps</option>
                <option value="bodyFat">Body Fat</option>
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
              </select>

              <button
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded w-full sm:w-auto"
                onClick={addGoal}
              >
                Add
              </button>
            </div>

            <ul className="space-y-2">
              {goals.map(goal => (
                <li
                  key={goal.id}
                  className="flex justify-between items-center bg-black border border-purple-700 p-2 rounded"
                >
                  <span className={goal.completed ? "line-through text-gray-500" : ""}>
                    {goal.goalName} ({goal.goalType}) - {goal.targetValue}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleGoal(goal)}
                      className="bg-green-600 px-2 py-1 rounded"
                    >
                      {goal.completed ? "Undo" : "Complete"}
                    </button>

                    <button
                      onClick={() => deleteGoal(goal)}
                      className="bg-red-600 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= CALCULATOR + CHART (SAME ROW) ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT SIDE - CALCULATOR */}
            <div className="bg-gray-900 border border-purple-700 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">
                Fitness Calculator (Custom Score + BMI)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {['age','weight','chest','height','bodyFat'].map((key,i)=>(
                  <div key={i}>
                    <label className="text-sm text-purple-300 mb-1 block">
                      {key.charAt(0).toUpperCase()+key.slice(1)}
                    </label>
                    <input
                      type="number"
                      value={fitnessInput[key]}
                      onChange={e =>
                        setFitnessInput({
                          ...fitnessInput,
                          [key]: e.target.value
                        })
                      }
                      className="bg-black border border-purple-600 p-2 rounded w-full"
                    />
                  </div>
                ))}
              </div>

              <button
                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded"
                onClick={calculateFitness}
              >
                Update Progress
              </button>
            </div>

            {/* RIGHT SIDE - CHART */}
            <div className="bg-gray-900 border border-purple-700 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">
                Progress Analytics
              </h2>

              {chartData.length === 0 ? (
                <p className="text-gray-400 text-center">No data available</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#2a2a2a" />
                    <XAxis dataKey="date" stroke="#a855f7" />
                    <YAxis stroke="#a855f7" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111",
                        borderColor: "#9333ea"
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="fitnessScore"
                      stroke="#06b6d4"
                      strokeWidth={3}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#22c55e" />
                    <Line type="monotone" dataKey="bmi" stroke="#f97316" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

          </div>

          {/* ================= PROGRESS HISTORY ================= */}
          <div className="bg-gray-900 border border-purple-700 p-6 rounded-xl overflow-x-auto">
            <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">
              Progress History
            </h2>

            <table className="w-full text-left border-collapse border border-gray-700">
              <thead>
                <tr>
                  <th className="border px-3 py-2">Date</th>
                  <th className="border px-3 py-2">Weight</th>
                  <th className="border px-3 py-2">Body Fat</th>
                  <th className="border px-3 py-2">Fitness Score</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {progressData.map(entry => (
                  <tr key={entry.id}>
                    <td className="border px-3 py-2">
                      {new Date(entry.date.seconds * 1000).toLocaleDateString()}
                    </td>
                    <td className="border px-3 py-2">{entry.weight}</td>
                    <td className="border px-3 py-2">{entry.bodyFat}</td>
                    <td className="border px-3 py-2">{entry.fitnessScore}</td>
                    <td className="border px-3 py-2">
                      <button
                        onClick={() => deleteProgress(entry.id)}
                        className="bg-red-600 px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}

export default Progress;