import { useState, useEffect } from "react";
import { motion } from "framer-motion";

//Meal Plans Data
const mealPlans = {
  "Muscle Gain": {
    price: 800,
    meals: [
      {
        name: "Breakfast: Oats & Eggs",
        calories: 450,
        protein: 30,
        carbs: 50,
        fats: 15,
      },
      {
        name: "Lunch: Chicken & Rice",
        calories: 600,
        protein: 40,
        carbs: 60,
        fats: 20,
      },
      {
        name: "Dinner: Salmon & Quinoa",
        calories: 550,
        protein: 35,
        carbs: 40,
        fats: 25,
      },
      {
        name: "Snacks: Nuts & Protein Shake",
        calories: 400,
        protein: 25,
        carbs: 20,
        fats: 30,
      },
    ],
  },
  "Fat Loss": {
    price: 600,
    meals: [
      {
        name: "Breakfast: Greek Yogurt & Berries",
        calories: 300,
        protein: 20,
        carbs: 25,
        fats: 10,
      },
      {
        name: "Lunch: Grilled Chicken Salad",
        calories: 400,
        protein: 35,
        carbs: 20,
        fats: 15,
      },
      {
        name: "Dinner: Tofu Stir Fry",
        calories: 350,
        protein: 25,
        carbs: 30,
        fats: 12,
      },
      {
        name: "Snacks: Boiled Eggs & Veggies",
        calories: 250,
        protein: 20,
        carbs: 10,
        fats: 10,
      },
    ],
  },
  Maintenance: {
    price: 700,
    meals: [
      {
        name: "Breakfast: Smoothie Bowl",
        calories: 400,
        protein: 20,
        carbs: 45,
        fats: 12,
      },
      {
        name: "Lunch: Turkey Wrap",
        calories: 500,
        protein: 30,
        carbs: 50,
        fats: 18,
      },
      {
        name: "Dinner: Grilled Fish & Veggies",
        calories: 450,
        protein: 30,
        carbs: 35,
        fats: 15,
      },
      {
        name: "Snacks: Cottage Cheese & Fruit",
        calories: 300,
        protein: 20,
        carbs: 25,
        fats: 10,
      },
    ],
  },
};

// Function: Calculate Required Calories
// Uses simplified Mifflin-St Jeor Formula
const calculateCalories = (weight, age, goal) => {
  const base = 10 * weight + 6.25 * 170 - 5 * age + 5;
  switch (goal) {
    case "Muscle Gain":
      return Math.round(base * 1.2 + 500);
    case "Fat Loss":
      return Math.round(base * 1.2 - 400);
    default:
      return Math.round(base * 1.2);
  }
};

// Main Component
const Diet = () => {
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(25);
  const [goal, setGoal] = useState("Maintenance");
  const [requiredCalories, setRequiredCalories] = useState(0);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [planPrice, setPlanPrice] = useState(0);

  // ---------- Effect ----------
  // Recalculate plan whenever weight, age or goal changes
  useEffect(() => {
    const cal = calculateCalories(weight, age, goal);
    setRequiredCalories(cal);
    setSelectedMeals(mealPlans[goal].meals);
    setPlanPrice(mealPlans[goal].price);
  }, [weight, age, goal]);

  const totalCalories = selectedMeals.reduce(
    (sum, meal) => sum + meal.calories,
    0,
  );
  const totalProtein = selectedMeals.reduce(
    (sum, meal) => sum + meal.protein,
    0,
  );
  const totalCarbs = selectedMeals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFats = selectedMeals.reduce((sum, meal) => sum + meal.fats, 0);

  // ---------- UI ----------
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-black via-gray-950 to-purple-950 text-white px-6">
      <motion.h1
        className="text-3xl font-bold text-center text-purple-500 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        My Nutrition Plan
      </motion.h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ================= Left Panel - User Inputs ================= */}
        <motion.div
          className="bg-gray-900 p-6 rounded-xl border border-purple-700 lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-lg font-semibold text-purple-400 mb-6">
            Your Details
          </h2>

          <div className="space-y-5 text-sm">
            <div>
              <label className="block mb-1 text-gray-400">Weight (kg)</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-black border border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={weight}
                onChange={(e) => setWeight(+e.target.value)}
              />
            </div>

            {/* Age Input */}
            <div>
              <label className="block mb-1 text-gray-400">Age</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-black border border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={age}
                onChange={(e) => setAge(+e.target.value)}
              />
            </div>

            {/* Goal Selection */}
            <div>
              <label className="block mb-1 text-gray-400">Goal</label>
              <select
                className="w-full p-2 rounded bg-black border border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              >
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Fat Loss">Fat Loss</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* ================= Right Panel - Plan Details ================= */}
        <motion.div
          className="lg:col-span-3 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Required Calories */}
            <div className="bg-gray-900 p-6 rounded-xl border border-purple-700">
              <p className="text-sm text-gray-400">Required Calories</p>
              <h3 className="text-2xl font-bold text-green-400 mt-2">
                {requiredCalories} kcal
              </h3>
            </div>

            {/* Plan Price */}
            <div className="bg-gray-900 p-6 rounded-xl border border-purple-700">
              <p className="text-sm text-gray-400">Daily Plan Price</p>
              <h3 className="text-2xl font-bold text-purple-400 mt-2">
                Rs. {planPrice}
              </h3>
            </div>
          </div>

          {/* Meals Section */}
          <div className="bg-gray-900 p-6 rounded-xl border border-purple-700">
            <h2 className="text-lg font-semibold text-purple-400 mb-6">
              Today's Meals
            </h2>

            {/* Meals List */}
            <div className="space-y-4">
              {selectedMeals.map((meal, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-purple-800 pb-3 text-sm"
                >
                  <div>
                    <p className="text-purple-300 font-medium">{meal.name}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Protein: {meal.protein}g • Carbohydrates: {meal.carbs}g •
                      Fats: {meal.fats}g
                    </p>
                  </div>

                  <span className="text-gray-300">{meal.calories} kcal</span>
                </div>
              ))}
            </div>

            {/* Totals Section */}
            <div className="mt-6 pt-4 border-t border-purple-700 text-sm">
              <p className="text-purple-400 font-semibold">
                Total Calories: {totalCalories} kcal
              </p>
              <p className="text-gray-400 mt-1">
                Total Protein: {totalProtein}g • Total Carbohydrates:{" "}
                {totalCarbs}g • Total Fats: {totalFats}g
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Diet;
