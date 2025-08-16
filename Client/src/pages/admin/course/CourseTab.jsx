import JoditEditor from "jodit-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, Loader2 } from "lucide-react";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { toast } from "sonner";

function CourseTab() {
  const params = useParams();
  const id = params.id;
  const {
    data: getCourseData,
    isLoading: getCourseIsLoading,
    refetch,
  } = useGetCourseByIdQuery(id, { refetchOnMountOrArgChange: true });

  const [publishCourse, {}] = usePublishCourseMutation();

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const editor = useRef(null);
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const course = getCourseData?.course;
  console.log(course);

  useEffect(() => {
    if (!course) return;
    setInput({
      courseTitle: course.course_title || "",
      subTitle: course.subtitle || "",
      description: course.description || "",
      category: course.category || "",
      courseLevel: course.course_level || "",
      coursePrice: course.course_price ?? "",
      courseThumbnail: course.course_thumbnail || "",
    });
    setPreviewThumbnail(course.course_thumbnail || "");
  }, [course]);

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const joditConfig = useMemo(
    () => ({
      readonly: false,
      toolbarSticky: false,
      placeholder: "Write a clear, helpful description…",
    }),
    []
  );

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((p) => ({ ...p, [name]: value }));
  };
  const selectCategory = (value) =>
    setInput((p) => ({ ...p, category: value }));
  const selectCourseLevel = (value) =>
    setInput((p) => ({ ...p, courseLevel: value }));

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInput((p) => ({ ...p, courseThumbnail: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreviewThumbnail(reader.result);
    reader.readAsDataURL(file);
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);
    await editCourse({ formData, id });
  };

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ id, query: !action });
      if (response.data) {
        refetch();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to publish or unpublish course");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course updated successfully");
      navigate("/admin/course");
    }
    if (error) toast.error(error.data.message || "Something went wrong");
  }, [isSuccess, error]);

  const submitHandler = () => console.log(input);
  const navigate = useNavigate();

  if (getCourseIsLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <Card className="relative overflow-hidden rounded-2xl border-0 shadow-xl">
      {/* subtle gradient wash */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background:radial-gradient(900px_900px_at_-10%_-20%,#6366f1,transparent_60%),radial-gradient(900px_900px_at_110%_120%,#ec4899,transparent_60%)]" />
      <CardHeader className="relative z-[1] flex flex-row items-start justify-between gap-4 border-b bg-white/60 px-6 py-5 backdrop-blur-sm dark:bg-gray-900/60">
        <div>
          <CardTitle className="text-2xl tracking-tight">
            Basic Course Information
          </CardTitle>
          <CardDescription className="mt-1">
            Make changes to your course here. Click save when you're done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow hover:from-indigo-600 hover:to-purple-700"
            onClick={() => publishStatusHandler(course.is_published)}
          >
            {course.is_published ? "Unpublish" : "Publish"}
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 bg-white/70 backdrop-blur-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
          >
            Remove Course
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative z-[1] p-6">
        <div className="mt-2 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm text-gray-600 dark:text-gray-300">
              Title
            </Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Eg. Fullstack Developer"
              className="h-11 rounded-xl border-gray-200 bg-white/70 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900/60"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-600 dark:text-gray-300">
              Subtitle
            </Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a fullstack dev from zero in 2 months"
              className="h-11 rounded-xl border-gray-200 bg-white/70 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900/60"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-600 dark:text-gray-300">
              Description
            </Label>
            <div className="rounded-xl border border-gray-200 bg-white/70 p-2 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60">
              <JoditEditor
                ref={editor}
                config={joditConfig}
                value={input.description}
                onBlur={(html) =>
                  setInput((prev) => ({ ...prev, description: html }))
                }
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm text-gray-600 dark:text-gray-300">
                Category
              </Label>
              <Select onValueChange={selectCategory}>
                <SelectTrigger className="h-11 w-full rounded-xl border-gray-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900/60">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                    <SelectItem value="DBMS">DBMS</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-600 dark:text-gray-300">
                Course Level
              </Label>
              <Select onValueChange={selectCourseLevel}>
                <SelectTrigger className="h-11 w-full rounded-xl border-gray-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900/60">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-600 dark:text-gray-300">
                Price (INR)
              </Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="h-11 w-full rounded-xl border-gray-200 bg-white/70 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900/60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Course Thumbnail</Label>

            <div className="grid items-start gap-6 md:grid-cols-[280px,1fr]">
              {/* Left: input */}
              <div className="flex flex-col gap-2">
                <Input
                  onChange={selectThumbnail}
                  type="file"
                  accept="image/*"
                  className="h-11 w-full rounded-xl border-gray-200 bg-white/70 backdrop-blur-sm
                   file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100
                   file:px-4 file:py-2 file:text-sm hover:file:bg-gray-200
                   dark:border-gray-800 dark:bg-gray-900/60 dark:file:bg-gray-800
                   dark:hover:file:bg-gray-700"
                />
                <p className="text-xs text-gray-500">
                  PNG/JPG/WebP • up to 5MB
                </p>
              </div>

              {/* Right: preview box */}
              <div className="h-40 w-72 overflow-hidden rounded-xl ring-1 ring-gray-200 shadow-sm dark:ring-gray-800">
                {previewThumbnail ? (
                  <img
                    src={previewThumbnail}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-sm text-gray-400">
                    No preview
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              onClick={() => navigate("/admin/course")}
              variant="outline"
              className="h-11 rounded-xl border-gray-300 bg-white/70 px-5 backdrop-blur-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/60 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={updateCourseHandler}
              disabled={isLoading}
              className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 text-white shadow hover:from-indigo-600 hover:to-purple-700 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseTab;
