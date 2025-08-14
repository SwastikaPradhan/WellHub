"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function NutritionTracker() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [servings, setServings] = useState(1);
  const [intakeTime, setIntakeTime] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");
  const [date, setDate] = useState<Date | null>(new Date());

  const getButtonClass = (meal: string) =>
    `px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${selectedMeal === meal ? "bg-lime-300" : "bg-lime-50"
    }`;

  useEffect(() => {
    if (query.trim().length === 0) return;
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(
          `https://trackapi.nutritionix.com/v2/search/instant?query=${query}`,
          {
            headers: {
              "x-app-id": "76aac46c",
              "x-app-key": "c80e959bb710191b39bb19ce9eae2988",
            },
          }
        );
        setSuggestions(res.data.common || []);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      }
    };
    fetchSuggestions();
  }, [query]);

  const fetchNutritionDetails = async (foodName: string) => {
    try {
      const res = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query: foodName },
        {
          headers: {
            "x-app-id": "76aac46c",
            "x-app-key": "c80e959bb710191b39bb19ce9eae2988",
            "Content-Type": "application/json",
          },
        }
      );
      setSelectedFood(res.data.foods[0]);
      setSuggestions([]);
      setQuery(foodName);
    } catch (error) {
      console.error("Error fetching food details", error);
    }
  };

  const handleSaveActivity = async () => {
    if (!selectedFood || !intakeTime) {
      toast.error("Please select food and intake time");
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/log/nutrition`, {
        servings,
        intaketime: intakeTime,
        foodItem: {
          name: selectedFood.food_name,
          calories: selectedFood.nf_calories,
          protein: selectedFood.nf_protein,
          carbs: selectedFood.nf_total_carbohydrate,
          fat: selectedFood.nf_total_fat,
        },
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success("Nutrition activity saved successfully!");
    } catch (err) {
      toast.error("Error saving activity");
      console.error(err);
    }
  };

  const handleDownloadReport = () => {
    const blob = new Blob(
      [
        `Food: ${selectedFood?.food_name}\nServings: ${servings}\nCalories: ${selectedFood?.nf_calories}\nProtein: ${selectedFood?.nf_protein}\nCarbs: ${selectedFood?.nf_total_carbohydrate}\nFat: ${selectedFood?.nf_total_fat}`,
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nutrition-report-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calc = (val: number) => (val * servings).toFixed(1);
  const calorieGoal = 2500;
  const caloriePercent = selectedFood ? ((selectedFood.nf_calories * servings) / calorieGoal * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-[#fffcee] flex flex-col md:flex-row items-start justify-center gap-10 p-8 overflow-auto">
      <Toaster />
      {/* Calendar */}
      <div className="bg-white shadow-md rounded-xl p-6 w-[320px]">
        <h2 className="text-lg font-bold text-black mb-2">YEAR 2025</h2>
        <Calendar
          onChange={(value) => setDate(value as Date)}
          value={date}
          className="text-sm w-full"
        />
      </div>

      {/* Right Side UI */}
      <div className="bg-white shadow-xl rounded-xl px-10 py-10 w-full max-w-4xl">
        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search.."
            className="w-full pl-12 pr-4 py-4 rounded-full bg-[#fde8dd] placeholder:text-[#a8a8a8] text-base text-gray-700 outline-none"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a8a8a8]" />
          {suggestions.length > 0 && (
            <ul className="absolute z-50 bg-white w-full mt-2 shadow rounded-lg overflow-hidden">
              {suggestions.map((item: any, index) => (
                <li
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => fetchNutritionDetails(item.food_name)}
                >
                  {item.food_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-4 mb-8">
          {["Breakfast", "Lunch", "Dinner"].map((meal) => (
            <button
              key={meal}
              onClick={() => setSelectedMeal(meal)}
              className={getButtonClass(meal)}
            >
              {meal}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold text-gray-800">Number of Servings</label>
          <select
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            className="w-full rounded-full border px-6 py-3 text-base outline-none"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="mb-10">
          <label className="block mb-2 text-lg font-semibold text-gray-800">Intake Time</label>
          <select
            value={intakeTime}
            onChange={(e) => setIntakeTime(e.target.value)}
            className="w-full rounded-full border px-6 py-3 text-base outline-none"
          >
            <option value="">Select Time</option>
            <option value="8:00 AM">8:00 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="7:00 PM">7:00 PM</option>
          </select>
        </div>

        {selectedFood && (
          <div className="mb-10">
            <h4 className="text-xl font-bold mb-6">Macros</h4>
            <div className="grid grid-cols-4 gap-4">
              <div><p className="text-sm">Calories</p><p className="text-xl font-semibold">{calc(selectedFood.nf_calories)} kcal</p></div>
              <div><p className="text-sm">Protein</p><p className="text-xl font-semibold">{calc(selectedFood.nf_protein)} g</p></div>
              <div><p className="text-sm">Carbs</p><p className="text-xl font-semibold">{calc(selectedFood.nf_total_carbohydrate)} g</p></div>
              <div><p className="text-sm">Fat</p><p className="text-xl font-semibold">{calc(selectedFood.nf_total_fat)} g</p></div>
            </div>
          </div>
        )}

        {selectedFood && (
          <div className="mb-10">
            <h4 className="text-xl font-bold mb-6">Percent of your Daily Goal</h4>
            {[
              { label: "Calories", percent: +caloriePercent, value: calc(selectedFood.nf_calories), color: "bg-red-400" },
              { label: "Fats", percent: ((selectedFood.nf_total_fat * servings) / 70 * 100).toFixed(0), value: calc(selectedFood.nf_total_fat), color: "bg-yellow-400" },
              { label: "Carbs", percent: ((selectedFood.nf_total_carbohydrate * servings) / 300 * 100).toFixed(0), value: calc(selectedFood.nf_total_carbohydrate), color: "bg-blue-400" },
              { label: "Protein", percent: ((selectedFood.nf_protein * servings) / 100 * 100).toFixed(0), value: calc(selectedFood.nf_protein), color: "bg-green-400" },
            ].map((item, i) => (
              <div key={i} className="mb-6">
                <div className="flex justify-between text-base mb-2 text-gray-800 font-medium">
                  <span>{item.label}</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full">
                  <div className={`h-3 ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                </div>
                <div className="text-right text-sm text-gray-500 mt-1">{item.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-6">
          <button onClick={handleSaveActivity} className="flex-1 py-3 bg-[#e6e0ff] rounded-full text-base font-semibold text-black shadow">
            Save Activity 🚀
          </button>
          <button onClick={handleDownloadReport} className="flex-1 py-3 bg-[#f2f1f6] rounded-full text-base font-semibold text-black shadow">
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

