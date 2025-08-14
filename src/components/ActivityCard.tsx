"use client";

import { FaHeart, FaWalking, FaFire } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface DashboardData {
  steps: number;
  heartRate: number;
  calories: number;
  activeMinutes: number;
}

export default function ActivityCard() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.accessToken) {
      setError("Please log in to view your activity data");
      return;
    }

    const fetchActivityData = async () => {
      setLoading(true);
      setError(null);

      try {
       
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard-data`,
          {
            method: "POST",
            credentials:"include",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              aggregateBy: [
                { dataTypeName: "com.google.step_count.delta" },
                { dataTypeName: "com.google.heart_rate.bpm" },
                { dataTypeName: "com.google.calories.expended" },
                { dataTypeName: "com.google.active_minutes" },
              ],
              bucketByTime: { durationMillis: 86400000 }, // per day
              startTimeMillis: Date.now() - 24 * 60 * 60 * 1000, // last 24 hrs
              endTimeMillis: Date.now(),
            }),
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        // Parse data safely
        const steps =
          json.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
        const heartRate =
          json.bucket?.[0]?.dataset?.[1]?.point?.[0]?.value?.[0]?.fpVal || 0;
        const calories =
          json.bucket?.[0]?.dataset?.[2]?.point?.[0]?.value?.[0]?.fpVal || 0;
        const activeMinutes =
          json.bucket?.[0]?.dataset?.[3]?.point?.[0]?.value?.[0]?.intVal || 0;

        setData({ steps, heartRate, calories, activeMinutes });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [session?.accessToken]);

  return (
    <div className="bg-[#FFFDF5] p-4 rounded-2xl shadow w-[370px]">
      <h2 className="text-xl font-mono text-gray-800 mb-4">Activity</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-gray-600">Loading activity data...</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-center">
          <div className="bg-[#E7E4FD] p-2 rounded-full">
            <FaHeart className="text-purple-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Heart rate</p>
          <p className="text-sm font-semibold">
            {loading ? "..." : data ? `${data.heartRate} bpm` : "N/A"}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-black p-2 rounded-full">
            <FaWalking className="text-white" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Total steps</p>
          <p className="text-sm font-semibold">
            {loading ? "..." : data ? data.steps.toLocaleString() : "0"}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-[#FEF4C3] p-2 rounded-full">
            <FaFire className="text-yellow-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Kcal burn</p>
          <p className="text-sm font-semibold">
            {loading ? "..." : data ? `${data.calories} kcal` : "N/A"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-sm mb-1 font-mono">Move</p>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-purple-400 h-2 rounded-full"
              style={{
                width: data ? `${Math.min((data.activeMinutes / 60) * 100, 100)}%` : "0%",
              }}
            ></div>
          </div>
        </div>
        <div>
          <p className="text-sm mb-1 font-mono">Exercise</p>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-yellow-300 h-2 rounded-full"
              style={{
                width: data ? `${Math.min((data.activeMinutes / 30) * 100, 100)}%` : "0%",
              }}
            ></div>
          </div>
        </div>
        <div>
          <p className="text-sm mb-1 font-mono">Steps</p>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-black h-2 rounded-full"
              style={{
                width: data ? `${Math.min(data.steps / 100, 100)}%` : "0%",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
