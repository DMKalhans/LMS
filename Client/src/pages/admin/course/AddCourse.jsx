import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BookOpen, Tag, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCreateCourseMutation } from "@/features/api/courseApi";

export default function AddCourse() {
  const navigate = useNavigate();
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [createCourse, { data, error, isLoading, isSuccess }] = useCreateCourseMutation();

  const createCourseHandler = async () => {
    if (!courseTitle || !category) {
      toast.error("Please enter a title and choose a category.");
      return;
    }
    await createCourse({ courseTitle, category });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created successfully.");
      setTimeout(() => navigate("/admin/course"), 500);
    }
    if (error) toast.error("Failed to create the course.");
  }, [isSuccess, error, data, navigate]);

  return (
    <div className="relative min-h-[calc(100vh-64px)]">
      {/* Premium gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_10%_10%,_#A7F3D0_0%,_transparent_40%),radial-gradient(70%_50%_at_90%_0%,_#93C5FD_0%,_transparent_40%),linear-gradient(135deg,_#0EA5E9_0%,_#6366F1_50%,_#9333EA_100%)] opacity-[0.10]" />

      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Eyebrow + Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            New Course
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            Add Basic Details for Your Course
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Give your course a clear title and the right category. You can refine everything later.
          </p>
        </div>

        <Card className="backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/60 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-0">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Course Overview</h2>
                <p className="text-xs text-muted-foreground">This info helps learners find your course.</p>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="grid gap-6 p-6">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="courseTitle">Title</Label>
              <div className="relative">
                <Input
                  id="courseTitle"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g., JavaScript: From Basics to Advanced"
                  className="h-11 pr-10"
                />
                <BookOpen className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Keep it clear and searchable (50–70 characters is ideal).
              </p>
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <div className="relative">
                <Select onValueChange={setCategory}>
                  <SelectTrigger id="category" className="h-11 w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Popular</SelectLabel>
                      <SelectItem value="Next JS">Next JS</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                      <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>
                      <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
                      <SelectItem value="Javascript">JavaScript</SelectItem>
                      <SelectItem value="Python">Python</SelectItem>
                      <SelectItem value="Docker">Docker</SelectItem>
                      <SelectItem value="MongoDB">MongoDB</SelectItem>
                      <SelectItem value="HTML">HTML</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Tag className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between gap-3 p-6">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/course")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              size="sm"
              onClick={createCourseHandler}
              disabled={isLoading}
              className="shadow-[0_6px_18px_rgba(99,102,241,0.35)] transition-transform hover:-translate-y-0.5"
            >
              {isLoading ? "Creating…" : "Create"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
