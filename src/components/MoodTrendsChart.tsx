'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { databases } from '@/lib/appwrite';
import { parseISO, format, startOfWeek, endOfWeek } from 'date-fns';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_JOURNAL!;

type MoodPoint = {
  day: string;
  mood: number;
};

export default function MoodTrendsChart() {
  const [data, setData] = useState<MoodPoint[]>([]);

  useEffect(() => {
    async function fetchMoodData() {
      try {
        const res = await databases.listDocuments(databaseId, collectionId);

        const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
        const thisWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }); // Sunday

        const dailyMap: Record<string, number[]> = {
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: [],
          Sun: [],
        };

        res.documents.forEach((doc) => {
          if (!doc.date || typeof doc.mood !== 'number') return;

          const dateObj = parseISO(doc.date);
          if (dateObj < thisWeekStart || dateObj > thisWeekEnd) return;

          const day = format(dateObj, 'EEE'); // Mon, Tue, ...
          if (dailyMap[day]) {
            dailyMap[day].push(doc.mood);
          }
        });

        const chartData = Object.entries(dailyMap).map(([day, moods]) => ({
          day,
          mood:
            moods.length > 0
              ? Math.round(moods.reduce((a, b) => a + b, 0) / moods.length)
              : 0,
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching mood data:', error);
      }
    }

    fetchMoodData();
  }, []);

  return (
    <Card className="p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-300">
      <h3 className="font-semibold text-sm text-gray-500">Mood Trends</h3>
      <h2 className="text-2xl font-bold text-gray-900">Happy vs. Bad</h2>
      <p className="text-sm text-gray-500 mb-4">Daily Data (This Week)</p>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#4B5563"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
