"use client";

import React, { useEffect, useState } from "react";

interface DailyProgressProps {
  percentage?: number; 
}

export default function DailyProgress({ percentage = 85 }: DailyProgressProps) {
  const [progress, setProgress] = useState<number>(percentage);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/dailyprogress`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch progress");
        }
        const data = await res.json();
        setProgress(data.percentage || 0);
      } catch (err) {
        console.error("Error fetching progress", err);
      }
    };

    fetchProgress();
  }, []);

  const radius = 90;
  const stroke = 18;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference; // ✅ use progress

  return (
    <div
      className="bg-[#f9f9fb] rounded-xl p-6 shadow text-center"
      style={{ width: "380px", height: "480px" }}
    >
      <h2
        className="text-[20px] font-medium text-[#1e1e1e] mb-6 font-sans "
        style={{ fontFamily: "Geist Mono, monospace" }}
      >
        Daily progress
      </h2>

      <div className="relative w-[180px] h-[180px] mx-auto">
        <svg height="100%" width="100%">
          <circle
            stroke="#ede9fe"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="50%"
            cy="50%"
          />
          <circle
            stroke="#c4b5fd"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset} // ✅ use updated offset
            r={normalizedRadius}
            cx="50%"
            cy="50%"
            transform="rotate(-90, 90, 90)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[32px] font-semibold text-[#1e1e1e] font-sans">
          {progress}% {/* ✅ show progress */}
        </div>
      </div>
      <p
        className="mt-6 text-[16px] font-medium text-gray-600 leading-relaxed"
        style={{ fontFamily: "Geist Mono, monospace" }}
      >
        Keep working on your
        <br />
        nutrition and sleep
      </p>
    </div>
  );
}




