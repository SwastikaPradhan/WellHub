
"use client";

import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";

interface FoodItem {
  id: number;
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
}

interface Props {
  onSelect: (food: FoodItem) => void;
}

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!query.trim()) return setSuggestions([]);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/foods?search=${query}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (food: FoodItem) => {
    setQuery(food.name);
    setShowDropdown(false);
    setSuggestions([]);
    onSelect(food);
  };

  return (
    <div className="relative mb-6">
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
        <BsSearch />
      </span>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        className="w-full py-3 pl-10 pr-6 rounded-full bg-[#fde8dd] text-sm text-gray-700 outline-none placeholder:text-[#a8a8a8]"
      />

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-white shadow-xl rounded-md max-h-60 overflow-y-auto border border-gray-200">

          {suggestions.map((food) => (
            <li
              key={food.id}
              onClick={() => handleSelect(food)}
              className="px-4 py-2 hover:bg-[#fdf6e3] cursor-pointer text-sm"
            >
              {food.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
