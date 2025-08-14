"use client";

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
  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Sep", "Aug", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Calories",
        data: [1100, 600, 1300, 900, 700, 1000, 1200, 2000, 850, 1300, 600, 800],
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
    maintainAspectRatio: false, // Important to allow height control
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          stepSize: 500,
        },
        grid: {
          borderDash: [4, 4],
          color: "#ccc",
        },
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


