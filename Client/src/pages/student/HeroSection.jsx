import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

function HeroSection() {
  return (
    <div
      className="relative bg-gradient-to-r from-teal-500 to-cyan-400
 dark:from-gray-900 dark:to-gray-950 py-24 px-4 text-center"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-4 mt-3">
          Master New Skills, Anytime, Anywhere
        </h1>
        <p className="text-gray-200 dark:text-gray-400  mb-8">
          Choose from a wide range of expert-led courses to reach your goals.
        </p>
        <form
          action=""
          className="
            flex items-center 
            bg-[rgba(255,255,255,0.2)] dark:bg-[rgba(0,0,0,0.4)]
            border border-[rgba(255,255,255,0.3)] dark:border-[rgba(255,255,255,0.2)]
            backdrop-blur-md 
            rounded-full 
            overflow-hidden 
            max-w-xl 
            mx-auto 
            mb-6 
            transition-all 
            duration-300
            shadow-[0_4px_20px_rgba(0,0,0,0.2),inset_0_0_10px_rgba(255,255,255,0.2)]
            focus-within:shadow-[0_0_15px_rgba(255,255,255,0.5)]
          "
        >
          <Input
            type="text"
            placeholder="Search courses..."
            className="
              flex-grow 
              bg-transparent 
              border-none 
              focus:outline-none 
              text-white dark:text-gray-100 
              px-6 py-3 
              placeholder:text-white dark:placeholder:text-gray-500
            "
          />
          <Button
            className="
                bg-[rgba(255,255,255,0.25)] 
                hover:bg-[rgba(255,255,255,0.35)] 
                border-l border-white/30   
              dark:from-indigo-500 dark:to-purple-600
              dark:hover:from-indigo-600 dark:hover:to-purple-700
              text-white 
              font-semibold
              px-6 py-3 
              rounded-r-full 
              shadow-md
              transition-all 
              duration-300
            "
          >
            Search
          </Button>
        </form>
        <Button
          className="
   bg-[#0088cc] hover:bg-[#006ba1]
 
    dark:bg-indigo-500 
    dark:hover:bg-indigo-600
    text-white 
    font-semibold 
    px-8 py-4 
    rounded-full 
    shadow-md 
    hover:shadow-lg 
    transition-all 
    duration-300
    mt-3
  "
        >
          Explore Courses
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
