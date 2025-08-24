"use client";
import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
//@ts-ignore
import { DateRange } from 'react-date-range';

import CaloriesChart from "@/components/CaloriesChart";
import HabitCard from "@/components/HabitCard";
import DailyProgress from "@/components/DailyProgress";
import MeditationCard from "@/components/MeditationCard";
import Sidebar from "@/components/Sidebar";
import axios from "axios";

export default function Dashboard() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection' as const,
    },
  ]);
  
  const [username, setusername] = useState("");
  const [summary, setSummary] = useState({
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
  });
  useEffect(() => {
    const fetchNutritionSummary = async () => {
      try {
        const start = range[0].startDate?.toISOString().split("T")[0];
        const end = range[0].endDate?.toISOString().split("T")[0];

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/nutritiondata`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(response.data.summary);
      } catch (err) {
        console.error("Failed to fetch nutrition data", err);
      }
    };
    fetchNutritionSummary();
  }, [range]);
  //username
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/username`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setusername(res.data.username);
      } catch (err) {
        console.error("Failed to fetch username", err);
      }
    };
    fetchUsername();
  }, []);
  const [timeFilter, setTimeFilter] = useState("24h");
  return (
    
    <AuthGuard>
      <div className="h-screen flex flex-row bg-yellow-50 text-[#1A1A1A] overflow-hidden">
        {/* Sidebar */}
       <Sidebar />
        {/* Dashboard Content */}
        <main className="flex-1 min-h-screen w-full p-6 md:p-10 space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <div>
              <h2
                className="text-gray-600"
                style={{ fontFamily: "Geist Mono", fontSize: "40px" }}
              >
                Dashboard
              </h2>

              <h1 className="text-2xl font-bold mt-1">Hi, {username}!</h1>
            </div>
            {/* Calendar + Time Filters */}
            <div className="flex items-center gap-2 ">
              {showCalendar && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                  <DateRange
                    ranges={range}
                    onChange={(item: any) => setRange([item.selection])}
                  />
                </div>
              )}

            </div>
          </div>
          {/* Top Metrics Cards */}
          <div className="flex flex-wrap gap-9 ml-4">
            {[
              {
                icon: "🔥",
                title: "Total Calories",
                value: `${summary.calories} kcal`,
                delta: "+1.45% vs last month",
                color: "green",
              },
              {
                icon: "🍞",
                title: "Total Carb",
                value: `${summary.carbs} gr`,
                delta: "+0.78% vs last month",
                color: "yellow",
              },
              {
                icon: "🧬",
                title: "Total Proteins",
                value: `${summary.protein} gr`,
                delta: "-2.84% vs last month",
                color: "orange",
              },
              {
                icon: "🥚",
                title: "Total Fats",
                value: `${summary.fat} gr`,
                delta: "+4.16% vs last month",
                color: "gray",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="w-[300px] h-[100px] bg-white rounded-[16px] shadow p-4 flex items-center gap-8"
              >
                <div
                  className={`w-12 h-12 rounded-[10px] flex items-center justify-center text-2xl bg-${card.color}-200`}
                >
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-lg font-bold text-gray-800">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.delta}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <div className="flex-1 ml-[50px]">
              <div className="h-[270px] " style={{ marginTop: "-15px" }}>
                <CaloriesChart /> </div>
            </div>
           
          </div>
          {/* Habit + Progress + Meditation */}
          <div className="flex flex-col lg:flex-row  w-full mt-4"
            style={{ marginTop: "-1px" }}
          >
            <div className="flex-1 mt-14">
              <HabitCard />
            </div>
            <div className="w-[305px] mt-9" style={{ position: "relative", left: "-250px" }}>
              <DailyProgress percentage={85} />
            </div>
            <div className="w-[250px] mt-4" style={{ position: "relative", left: "-200px" }}>
              <MeditationCard />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
