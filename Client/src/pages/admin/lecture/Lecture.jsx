import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function Lecture({ lecture, index, id: courseId }) {
  const navigate = useNavigate();

  const updateLectureHandler = () => {
    navigate(`${lecture.id}`);
  };

  return (
    <div
      className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-900/70"
    >
      {/* Lecture Title */}
      <h1 className="font-semibold tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">Lecture {index + 1}:</span>
        {lecture.lecture_title}
      </h1>

      {/* Edit Button */}
      <button
        onClick={updateLectureHandler}
        className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
      >
        <Edit className="h-4 w-4" />
        Edit
      </button>
    </div>
  );
}

export default Lecture;
