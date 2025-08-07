import React from "react";
import Course from "./Course";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"; // Optional CTA
import { Link } from "react-router-dom";
import { useLoadMyLearningQuery } from "@/features/api/authApi";

function MyLearning() {
  const { data, isLoading } = useLoadMyLearningQuery();

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  const { courses: myCourses } = data.user;

  return (
    <div className="max-w-4xl mx-auto my-24 px-4 md:px-0">
      <h1 className="font-bold text-2xl mb-6 text-center md:text-left">
        COURSES ENROLLED:
      </h1>

      <div className="my-5">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myCourses.length === 0 || myCourses[0] === null ? (
          <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-300" />
            </div>
            <p className="text-sm text-muted-foreground">
              You are not enrolled in any course yet!
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Link to="/">Browse Courses</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-col-1 sd:grid-cols-2 md:grid-cols-3 gap-15 ">
            {myCourses.map((items, index) => (
              <Course key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLearning;

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);
