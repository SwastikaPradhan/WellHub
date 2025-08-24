"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleConnect = async () => {
    const token = localStorage.getItem("token");
    try {
      // request to Google Fit API 
      const res = await fetch(
        "https://wellnessbackend-v1qw.onrender.com/api/connect",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error(`Google Fit request failed: ${res.status}`);
      const data = await res.json();
      alert("Successfully connected to Google Fit! Check console for details.");
    } catch (err) {
      console.error(err);
      alert("Failed to connect to Google Fit");
    }
  };

  return (
    <main>
      <Image
        src="/Frame9herosec.png"
        alt="Hero Background"
        fill
        className="object-cover"
        priority
      />
      {/* Content Container */}
      <div className="relative z-10 px-6 md:px-16 pt-6 pb-0 w-full">
        {/* Navbar */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-black rotate-45"></div>
            <h1 className="text-3xl ">Wellness Hub</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-base font-medium">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              <a
                href="/dashboard"
                className="px-4 py-2 rounded-full bg-lime-700 text-white font-semibold text-sm hover:bg-lime-800"
              >
                Dashboard
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/signup")}
                className="px-4 py-2 rounded-full bg-lime-700 text-white font-semibold text-sm hover:bg-lime-800"
              >
                Sign Up as Client
              </button>
            </div>
          </div>
        </div>

        <div className="h-[470px]"></div>

        {/* Laptop Image Display */}
        <div className="flex justify-center relative">
          <Image
            src="/Group2345678.png"
            alt="Dashboard Laptop UI"
            width={1300}
            height={900}
            priority
          />
          <div className="absolute top-[40%] right-[370px] -translate-y-1/2 rounded-tl-3xl 
          rounded-tr-3xl rounded-bl-3xl rounded-br-none w-[100px] h-[100px] overflow-hidden">
            <Image
              src="/chatbotimage.jpg"
              alt="Robot Assistant"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>

        {/* Cards Section */}
        <section className="mt-16 text-center px-4 md:px-20">
          <h2 className="text-6xl mb-3 leading-[1.2] font-normal">
            What Brings You Here Today?
          </h2>
          <p className="text-xl text-gray-800 font-normal mb-8">
            Start your journey to better habits — pick a focus area to begin.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-1 gap-y-4">
            {/* Card 1 */}
            <div className="relative bg-orange-400 rounded-2xl px-6 py-6 w-full h-60 overflow-hidden">
              <h3 className="text-white text-[32px] font-medium z-10 relative -ml-[120px]">
                Log Activity
              </h3>
              <Link href="/log-activity">
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-white text-black 
                rounded-full flex items-center justify-center text-4xl z-10">
                  ↗
                </div>
              </Link>

              <div className="absolute bottom-0 -right-8 w-[300px] h-[150px] z-0">
                <Image
                  src="/Frame10.png"
                  alt="Activity Log"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative bg-yellow-400 rounded-2xl px-6 py-6 w-full h-60 overflow-hidden">
              <h3 className="text-white text-[32px] font-medium z-10 relative -ml-[120px]">
                Nutrition Tracker
              </h3>
              <Link href="/nutrition-log">
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-white text-black 
                rounded-full flex items-center justify-center text-4xl z-10">
                  ↗
                </div>
              </Link>

              <div className="absolute bottom-0 -right-8 w-[300px] h-[150px] z-0">
                <Image
                  src="/Calendar.png"
                  alt="Calendar"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative bg-rose-400 rounded-2xl px-6 py-6 w-full h-60 overflow-hidden">
              <h3 className="text-white text-[32px] font-medium z-10 relative -ml-[120px]">
                Daily Journal
              </h3>
              <Link href="/journal">
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-white text-black
                 rounded-full flex items-center justify-center text-4xl z-10">
                  ↗
                </div>
              </Link>

              <div className="absolute bottom-0 -right-8 w-[300px] h-[150px] z-0">
                <Image
                  src="/34errrrrrrrrrf.png"
                  alt="Journal"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          </div>

          {/* Google Fit Section */}
          <section className="mt-32 text-center px-1 md:px-15 flex flex-col md:flex-row bg-[#fdefcf] min-h-[50vh]">
            {/* Left side image container */}
            <div className="relative md:w-1/2 h-64 md:h-auto">
              <Image
                src="/yogaimagesession.png"
                alt="Wellness silhouette with mandala"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Right side text container */}
            <div className="md:w-1/2 flex flex-col justify-center text-left py-10 md:py-16 px-2 md:px-10">
              <h2 className="text-3xl md:text-5xl font-semibold mb-6">
                Your All-in-One Wellness Companion
              </h2>

              <ul className="text-base md:text-lg text-black mb-8 space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  Track nutrition & workouts
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  Build mindful habits
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  Monitor Daily Activity
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  Stay motivated with daily tips
                </li>
              </ul>

              <button onClick={() => router.push("/signup")}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full max-w-max transition">
                Start Your Journey
              </button>
            </div>

          </section>
        </section>
      </div>
      <footer className="fixed-bottom left-0 right-0 w-full bg-gradient-to-r
       from-pink-200 via-yellow-200 to-orange-200 text-gray-800 py-8 mt-16 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8">

          {/* Left Side */}
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-900">WellnessHub</h2>
            <p className="text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>

          {/* Right Side */}
          <div className="text-sm max-w-lg text-center md:text-right">
            <h3 className="text-xl font-bold text-gray-900 mb-2">About Me</h3>
            <p>
              Hey, I'm <span className="font-medium text-gray-900">Swastika</span>!
              I am passionate about building tools that help people improve their lives
              through better habits and consistent practice.
            </p>
            <p className="mt-2 text-gray-600"> Created by swastikapradhan🎯 </p>
          </div>

        </div>
      </footer>
    </main>
  );
}
