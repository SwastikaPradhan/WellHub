"use client";
import { useEffect, useState } from "react";

interface Entry {
  id: string;
  mood: string;
  Topic: string;
  Journal: string;
  image_url: string | null;
  createdAt: string;
}

function formatDate(dateStr: string): string {
  const entryDate = new Date(dateStr);
  return entryDate.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isToday(dateStr: string) {
  const today = new Date();
  const d = new Date(dateStr);
  return d.toDateString() === today.toDateString();
}

function isYesterday(dateStr: string) {
  const today = new Date();
  const d = new Date(dateStr);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
}

export default function JournalList({ refreshKey }: { refreshKey: number }) {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const res = await fetch("/api/journal/create");
      const data = await res.json();
      setEntries([]);
    };
    fetchEntries();
  }, [refreshKey]);

  const todaysEntries = entries.filter((e) => isToday(e.createdAt));
  const yesterdaysEntries = entries.filter((e) => isYesterday(e.createdAt));

  return (
    <div className="mt-10 space-y-8">
      {/* Today's Entries */}
      {todaysEntries.length > 0 && (
        <div className="border p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Today's Journal</h2>
          {todaysEntries.map((entry) => (
            <div key={entry.id} className="mb-4">
              {entry.image_url && (
                <img
                  src={entry.image_url}
                  alt="Journal"
                  className="w-24 h-24 object-cover rounded mb-2"
                />
              )}
              <p><strong>Mood:</strong> {entry.mood}</p>
              <p><strong>Topics:</strong> {entry.Topic}</p>
              <p className="mt-1">{entry.Journal}</p>
              <p className="text-xs text-gray-500">{formatDate(entry.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Yesterday's Entries */}
      {yesterdaysEntries.length > 0 && (
        <div className="border p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Yesterday's Journal</h2>
          {yesterdaysEntries.map((entry) => (
            <div key={entry.id} className="mb-4">
              {entry.image_url && (
                <img
                  src={entry.image_url}
                  alt="Journal"
                  className="w-24 h-24 object-cover rounded mb-2"
                />
              )}
              <p><strong>Mood:</strong> {entry.mood}</p>
              <p><strong>Topics:</strong> {entry.Topic}</p>
              <p className="mt-1">{entry.Journal}</p>
              <p className="text-xs text-gray-500">{formatDate(entry.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
