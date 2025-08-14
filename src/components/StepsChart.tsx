'use client';

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import { databases } from '@/lib/appwrite'; 
import { parseISO, isWithinInterval, subDays } from 'date-fns';

 const databaseId= process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId= process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ACTIVITY!;

type WeekData = {
  week: string;
  steps: number;
};

export default function StepsTrendChart() {
  const [data, setData] = useState<WeekData[]>([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);

  useEffect(() => {
    async function fetchStepsData() {
      const res = await databases.listDocuments(databaseId, collectionId);

      const today = new Date();
      const thisMonthStart = subDays(today, 29);
      const lastMonthStart = subDays(today, 59);
      const lastMonthEnd = subDays(today, 30);

      const currentMonthSteps = [0, 0, 0, 0];
      let thisMonthTotal = 0;
      let lastMonthTotal = 0;

      res.documents.forEach((doc) => {
        if (!doc.timestamp || !doc.duration) return;

        const date = parseISO(doc.timestamp);
        const steps = doc.duration; 

        const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (isWithinInterval(date, { start: thisMonthStart, end: today })) {
          const weekIndex = Math.floor((29 - daysAgo) / 7);
          currentMonthSteps[weekIndex] += steps;
          thisMonthTotal += steps;
        } else if (
          isWithinInterval(date, { start: lastMonthStart, end: lastMonthEnd })
        ) {
          lastMonthTotal += steps;
        }
      });

      const trendData: WeekData[] = currentMonthSteps.map((steps, i) => ({
        week: `Week ${i + 1}`,
        steps,
      }));

      const change = lastMonthTotal
        ? (((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)
        : '100.0';

      setData(trendData);
      setTotalSteps(thisMonthTotal);
      setPercentageChange(parseFloat(change));
    }

    fetchStepsData();
  }, []);

  return (
    <div className="bg-white p-6 border rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-1">Monthly Steps Trend</h2>
      <p className="text-3xl font-bold">{totalSteps.toLocaleString()} steps</p>
      <p className={`mb-4 ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        Last 30 Days {percentageChange >= 0 ? '+' : ''}
        {percentageChange}%
      </p>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
        >
          <XAxis
            dataKey="week"
            interval={0}
            tick={{ fontSize: 12 }}
            padding={{ left: 20, right: 20 }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="steps"
            stroke="#4B5563"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
