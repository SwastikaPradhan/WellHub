"use client";

import Image from "next/image";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function LogActivity() {
  const [formData, setFormData] = useState({
    activity: "",
    subActivity: "",
    duration: "",
    intensity: ""
  });
  const [showActivityHeading, setShowActivityHeading] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "activity") {
      setFormData((prev) => ({ ...prev, activity: value, subActivity: "" }));
    } 
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleActivityFocus = () => {
    setShowActivityHeading(true);
  };
  const token =localStorage.getItem('token');

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activity/logactivity`,{
        method:"POST",
        headers:{"Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      if(response.ok){
        toast.success("Activity saved!",{
          position:"top-right",
          theme:"colored",
        })
      }else{
        toast.error("Failed to save activity",{
          position:"top-right",
          theme:"colored",
        })
        
      }
    }catch(error){
      toast.error("Something went wrong",{
          position:"top-right",
          theme:"colored",
        })
    }
  };
  const getSubActivityOptions = () => {
    switch (formData.activity) {
      case "Gym":
        return ["Push", "Pull", "Leg"];
      case "Yoga":
        return ["Hatha", "Sanyas", "Assan", "Surya Namaskar"];
      default:
        return [];
    }
  };
  const subActivityOptions = getSubActivityOptions();
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Side Image */}
      <div className="w-[40%] h-full relative">
        <Image src="/logActivity.png" alt="Yoga" fill className="object-cover" />
      </div>

      {/* Right Side Form */}
      <div className="w-[60%] bg-[#FFFCEB] flex flex-col items-center justify-center px-8">
       
        <h2 className="text-4xl font-bold text-gray-800 mb-10">Log Activity</h2>
        <div className="bg-white w-[800px] rounded-[16px] shadow-md p-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {showActivityHeading && (
              <label className="text-white font-semibold text-lg mb-2 block">
                Select Activity
              </label>
            )}

            <div>
             <label className="block mb-2 text-gray-700 font-medium text-lg">
                Activity
              </label>
            <select
              name="activity"
              value={formData.activity}
              onChange={handleChange}
              onFocus={handleActivityFocus}
              className="w-full px-6 py-5 rounded-full text-gray-800 text-lg focus:outline-none bg-white border border-[#d8d2fd]"
            >
              {!showActivityHeading && <option value="" disabled hidden />}
              <option value="">Select Activity</option>
              <option value="Yoga"style={{ backgroundColor: "#FEF08A" }}>
                Yoga
              </option>
              <option value="Walk" style={{ backgroundColor: "#FEF08A" }}>
                Walking
              </option>
              <option value="Run" style={{ backgroundColor: "#FEF08A" }}>
                Running
              </option>
              <option value="Gym" style={{ backgroundColor: "#FEF08A" }}>
                Gym
              </option>
              <option value="Cycling" style={{ backgroundColor: "#FEF08A" }}>
                Cycling
              </option>
            </select>
             </div>

            {subActivityOptions.length > 0 && (
              <div>
                <label className="block mb-2 text-gray-700 font-medium text-lg " >
                  {formData.activity} Details
                </label>
                <select
                  name="subActivity"
                  value={formData.subActivity}
                  onChange={handleChange}
                  className="w-full px-6 py-5 border border-[#d8d2fd] rounded-full text-gray-800 text-lg focus:outline-none " 
                >
                  <option value="">Select</option>
                  {subActivityOptions.map((opt) => (
                    <option key={opt} value={opt} style={{ backgroundColor: "#FEF08A" }}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}

            
            <div>
              <label className="block mb-2 text-gray-700 font-medium text-lg">
                Duration (Minutes)
              </label>
              <input
                type="number"
                name="duration"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-6 py-5 border border-[#d8d2fd] rounded-full text-gray-800 text-lg focus:outline-none"
              />
            </div>

            {/* Intensity */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium text-lg">
                Intensity
              </label>
              <select
                name="intensity"
                value={formData.intensity}
                onChange={handleChange}
                className="w-full px-6 py-5 border border-[#d8d2fd] rounded-full text-gray-800 text-lg focus:outline-none "
              >
                <option value="">Select Intensity</option>
                <option value="Low" style={{ backgroundColor: "#FEF08A" }}>Low</option>
                <option value="Medium" style={{ backgroundColor: "#FEF08A" }}>Medium</option>
                <option value="High" style={{ backgroundColor: "#FEF08A" }}>High</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-5 bg-[#d8d2fd] text-black font-bold rounded-full hover:bg-[#cfc5ff] transition text-lg"
            >
              Save Activity 🚀
            </button>
          </form>
           <ToastContainer />
        </div>
      </div>
    </div>
     
  );
}





















