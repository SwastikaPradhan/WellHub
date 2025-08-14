"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { databases, account, ID ,storage} from "@/lib/appwrite";
import ImageUpload from "@/components/ImageUpload";
import MicButton from "@/components/MicButton";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import JournalList from "@/components/JournalList";

export default function DailyJournal() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [entry, setEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [ImageUrl,setImageUrl]= useState<String | null>(null);
  const[refreshKey,setRefreshKey]=useState(0);

  const moods = ["Happy", "Content", "Neutral", "Sad", "Anxious"];
  const topics = ["Relationships", "Work", "Health", "Hobbies", "Personal Growth"];

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
      } catch (err) {
        console.error("Not logged in!");
      }
    };
    getUser();
  }, []);

  const handleSave = async () => {
  if (!entry || !date || !selectedMood || selectedTopics.length === 0) {
    alert("Don't be lazy! Fill out all the fields 😛");
    return;
  }
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/journal/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify({
        mood: selectedMood,
        topic: selectedTopics.join(", "),
        journal: entry,
        image_url: ImageUrl, 
      }),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success("Your journal data is successfully saved!");
      setEntry("");
      setSelectedMood("");
      setSelectedTopics([]);
      setImage(null);
      setImageUrl(null);
      setRefreshKey((prev)=>prev+1);
    } else {
      toast.error("Oops! Not saved.");

      console.error(result.error);
    }
  } catch (error) {
    console.error("Error hitting backend:", error);
    toast.error("Oops! Not saved.");

  }
};


  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  return (
    <div className="min-h-screen bg-[#fffcee] text-black px-6 pt-24 flex justify-center">
      <div className="flex w-full max-w-6xl gap-10">
        <div className="w-72 flex flex-col gap-6">
          {/* Calendar */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Today</h2>
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) setDate(value);
                else setDate(null);
              }}
              value={date}
              className="rounded-lg border border-gray-300 shadow"
            />
          </div>

          {/* Mood */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Mood</h2>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`px-3 py-1 border rounded-full ${
                    selectedMood === mood ? "bg-green-200 font-bold" : ""
                  } hover:bg-gray-200`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Topics</h2>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-3 py-1 border rounded-full text-sm ${
                    selectedTopics.includes(topic)
                      ? "bg-yellow-200 font-bold"
                      : "bg-gray-100"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Journal Entry */}
        <div className="flex-1">
      <h1 className="text-3xl font-bold mb-6">
        Daily Journal <span className="text-green-500">📝</span>
      </h1>

      <div className="relative w-full border border-gray-300 rounded-lg shadow mb-6 p-4">
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Spill the tea about your day............"
          rows={10}
          className="w-full h-60 pr-10 pl-10 pt-2 pb-12 resize-none focus:outline-none bg-transparent"
        ></textarea>

       <div className="mt-4">
        <ImageUpload onImageSelect={(file,uploadedUrl) =>{ 
          setImage(file);
          setImageUrl(uploadedUrl);
        }} />

       </div>
        <div className="absolute bottom-4 right-4">
          <MicButton onTranscript={(text) => setEntry((prev) => prev + " " + text)} />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition"
      >
        Save Entry 
      </button>
       <ToastContainer />
       <JournalList refreshKey={refreshKey} />

    </div>
      </div>
    </div>
  );
}

