import { BookOpen, Tag, ArrowLeft, Sparkles, Loader2, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useCreateLectureMutation, useGetCourseLectureQuery } from "@/features/api/courseApi";
import { toast } from "sonner";
import Lecture from "./Lecture";

function CreateLecture() {
  const navigate = useNavigate();
  const { id } = useParams(); // course id

  // data first, so hooks stay in stable order
  const {
    data: lectureData,
    isLoading: lectureIsLoading,
    refetch,
  } = useGetCourseLectureQuery(id);

  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();

  const [lectureTitle, setLectureTitle] = useState("");
  const canSubmit = lectureTitle.trim().length >= 3 && !isLoading;

  const createLectureHandler = async () => {
    if (!canSubmit) {
      toast.error("Please enter at least 3 characters for the title.");
      return;
    }
    await createLecture({ lectureTitle: lectureTitle.trim(), id });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture created successfully.");
      setLectureTitle("");
      refetch();
    } else if (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  }, [isSuccess, error, data, refetch]);

  // Enter to submit
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      createLectureHandler();
    }
  };

  const lectureCount = lectureData?.lectures?.length ?? 0;

  return (
    <div className="relative min-h-[calc(100vh-64px)]">
      {/* premium gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_10%_10%,_#A7F3D0_0%,_transparent_40%),radial-gradient(70%_50%_at_90%_0%,_#93C5FD_0%,_transparent_40%),linear-gradient(135deg,_#0EA5E9_0%,_#6366F1_50%,_#9333EA_100%)] opacity-[0.10]" />

      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Eyebrow + Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            New Lecture
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            Add your lecture title.
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Keep it clear and searchable. You can refine everything later.
          </p>
        </div>

        <Card className="border-0 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/60 rounded-2xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Lecture Overview</h2>
                <p className="text-xs text-muted-foreground">
                  This info helps learners find your course.
                </p>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="grid gap-6 p-6">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="lectureTitle">Title</Label>
              <div className="relative">
                <Input
                  id="lectureTitle"
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="e.g., Introduction to JavaScript"
                  className="h-11 pr-10"
                  aria-invalid={lectureTitle.trim().length > 0 && lectureTitle.trim().length < 3}
                />
                <BookOpen className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Aim for a concise, descriptive title (min 3 characters).
                </p>
                <span className="text-[11px] text-muted-foreground">
                  {lectureTitle.trim().length}/80
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between gap-3 p-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/course")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              size="sm"
              disabled={!canSubmit}
              onClick={createLectureHandler}
              className="shadow-[0_6px_18px_rgba(99,102,241,0.35)] transition-transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Lectures list */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <ListChecks className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">
                Lectures {lectureCount ? `(${lectureCount})` : ""}
              </h3>
            </div>
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          </div>

          {lectureIsLoading ? (
            <div className="grid gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-gray-200/70 dark:bg-gray-800/70 animate-pulse"
                />
              ))}
            </div>
          ) : !lectureData?.lectures?.length ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center">
              <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-primary/10 grid place-items-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                No lectures yet. Create your first one above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lectureData.lectures.map((lecture, index) => (
                <Lecture key={lecture.id ?? index} lecture={lecture} index={index} id={id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;
