"use client";

import Image from "next/image";


export default function MeditationCard() {
  return (
      <div className="relative w-full flex justify-center items-center"
      style={{ width: "380px", height: "200px" ,marginTop:"90px"}}
      
      >
        {/* Meditation image as-is */}
        <Image
          src="/medition-1.png"
          alt="Meditation"
          width={370}
          height={200}
          className="rounded-xl object-contain"
        />

        {/* Video play button overlaid at center */}
        <div className="absolute">
          <Image
            src="/video logo.png"
            alt="Play"
            width={30}
            height={30}
          />
        </div>
      </div>
  );
}

