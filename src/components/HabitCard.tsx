"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, Smile, Folder } from "lucide-react";
import Image from "next/image";
import {storage} from "@/lib/appwrite";

interface Journal {
  image_url?: string;
  topic: string;
  date: string;
  mood: string;
  journal: string;
}

export default function HabitCard() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  const fetchJournals = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/journaldata`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust based on your auth
        },
      });
      const data = await res.json();
      const journals=data.journals || [];

      const journalwithImage= await Promise.all(
        journals.map(async(journal:any)=>{
          if(journal.image_id){
            try{
              const imageUrl= storage.getFilePreview("NEXT_PUBLIC_APPWRITE_BUCKET_ID",journal.image_id);
              return {...journal,image_url:imageUrl.href};
            }catch(error){
              console.error("Error loading image from Appwrite:",error);
              return journal;
            }
          }
          return journal;
        })
      )
      setJournals(journalwithImage);
      setCheckedItems(new Array(journalwithImage.length || 0).fill(false));
    } catch (error) {
      console.error("Failed to fetch journals:", error);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const toggleCheckbox = (index: number) => {
    const updatedChecks = [...checkedItems];
    updatedChecks[index] = !updatedChecks[index];
    setCheckedItems(updatedChecks);
  };

  const anyChecked = checkedItems.some((item) => item);

  return (
    <div className="max-w-[750px] rounded-xl bg-[#F6F3FF] p-5 font-mono -mt-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Journal</h1>
        {anyChecked && (
          <div className="flex gap-2 text-sm">
            <button className="px-4 py-2 rounded-full bg-white text-purple-500 shadow-sm hover:bg-gray-100">
              Edit
            </button>
            <button className="px-4 py-2 rounded-full text-gray-500 hover:text-gray-700">
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
      {/* Journal List */}
      {journals.map((journal, index) => (
        <div
          key={index}
          className="flex items-start gap-3 px-2 py-3 mb-3 rounded-xl bg-white shadow-sm"
        >
          
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={journal.image_url || "/yogaimage.avif"}
              alt="Journal"
              width={56}
              height={56}
              className="rounded-xl object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-800">{journal.topic}</h3>
            <div className="text-sm text-gray-500 flex gap-3 flex-wrap mt-1">
              <span className="flex items-center gap-1">
                <CalendarDays size={14} className="text-purple-500" />
                {journal.date}
              </span>
              <span className="flex items-center gap-1">
                <Smile size={14} className="text-purple-500" />
                {journal.mood}
              </span>
              <span className="flex items-center gap-1">
                <Folder size={14} className="text-purple-500" />
                Journal
              </span>
            </div>
          </div>

          {/* Checkbox */}
          <input
            type="checkbox"
            checked={checkedItems[index]}
            onChange={() => toggleCheckbox(index)}
            className="accent-purple-400 h-5 w-5 mt-1"
          />
        </div>
      ))}
      </div>

    </div>
  );
}


