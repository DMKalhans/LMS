import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Film, Sparkles } from "lucide-react";
import CourseTab from "./CourseTab";

function EditCourse() {
  const navigate = useNavigate();

  return (
    <div className="relative flex-1">
      {/* soft premium backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-10
        [background:
          radial-gradient(70%_60%_at_10%_10%,#93C5FD_0%,transparent_40%),
          radial-gradient(60%_50%_at_90%_0%,#A78BFA_0%,transparent_40%),
          linear-gradient(135deg,#0EA5E9_0%,#6366F1_50%,#9333EA_100%)
        ]" />

      <div className="mx-auto max-w-5xl">
        {/* top header card */}
        <div className="mb-6 overflow-hidden rounded-2xl border-0 bg-white/70 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur dark:bg-gray-900/60">
          {/* tiny glow bar */}
          <div className="mb-4 h-1.5 w-28 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Course Setup
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">
                Add detailed information regarding your course
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Craft a great title, clear subtitle, engaging description, and correct level & category.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-gray-300 bg-white/70 backdrop-blur hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
                onClick={() => window.history.back()}
              >
                Back
              </Button>
              <Button
                onClick={() => navigate("lectures")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:from-indigo-600 hover:to-purple-700"
              >
                <Film className="mr-2 h-4 w-4" />
                Go to lectures page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* main content */}
        <CourseTab />
      </div>
    </div>
  );
}

export default EditCourse;
