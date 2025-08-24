"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function CaloriesChart() {
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await fetch(
        "https://wellnessbackend-v1qw.onrender.com/api/dashboard/chatdata",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to fetch data: ${res.status} ${errText}`);
      }

      const result = await res.json();
      console.log("API Response:", result);

      if (Array.isArray(result)) {
        
        const caloriesArray = result.map((item) => item.calories || 0);
        setChartData(caloriesArray);
      } else {
       
        setChartData(new Array(12).fill(0));
      }
    } catch (err) {
      console.error("Error fetching calories chart data:", err);
      setChartData(new Array(12).fill(0)); 
    }
  };

  fetchData();
}, []);



  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Calories",
        data: chartData.length > 0 ? chartData : new Array(12).fill(0), // fallback
        backgroundColor: (ctx: any) => {
          const index = ctx.dataIndex;
          return index === 7 ? "#D9C4FF" : "#FFE599";
        },
        borderRadius: 10,
        barThickness: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        ticks: { stepSize: 500 },
        grid: { borderDash: [4, 4], color: "#ccc" },
      },
    },
  };

  return (
    <div className="bg-[#FFFDF5] shadow p-4 rounded-xl w-full max-w-[1000px] h-[300px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-mono text-lg text-gray-800">Calories</h3>
        <select className="bg-[#EFEFFF] text-sm px-3 py-1 rounded-full">
          <option>Month</option>
        </select>
      </div>

      <div className="h-[220px] w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}


