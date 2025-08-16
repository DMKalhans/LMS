import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const params = useParams();
  const id = params.id;
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(id);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [
    completeCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useCompleteCourseMutation();
  const [
    inCompleteCourse,
    { data: markInCompleteData, isSuccess: inCompletedSuccess },
  ] = useInCompleteCourseMutation();

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData.message);
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData.message);
    }
  }, [completedSuccess, inCompletedSuccess]);

  const [currentLecture, setCurrentLecture] = useState(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course details</p>;

  const { courseDetails, progress, completed } = data.data;
  const { course_title } = courseDetails;
  // Initialize the first lecture if not exist
  const initialLecture =
    currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  const isLectureCompleted = (lecture_id) => {
    return progress.some(
      (prog) => prog.lecture_id === lecture_id && prog.viewed
    );
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ id, lectureId });
    refetch();
  };

  // Handle select a specific lecture to watch
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture.id);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(id);
  };

  const handleInCompleteCourse = async () => {
    await inCompleteCourse(id);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 pt-20">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{course_title}</h1>
        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>{" "}
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              src={currentLecture?.video_url || initialLecture?.video_url}
              controls
              className="w-full h-auto md:rounded-lg"
              onPlay={() =>
                handleLectureProgress(currentLecture?.id || initialLecture?.id)
              }
            />
          </div>
          <div className="mt-2 ">
            <h3 className="font-medium text-lg">
              {`Lecture ${
                courseDetails.lectures.findIndex(
                  (lec) => lec.id === (currentLecture?.id || initialLecture?.id)
                ) + 1
              } : ${
                currentLecture?.lecture_title || initialLecture?.lecture_title
              }`}
            </h3>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures.map((lecture) => (
              <Card
                key={lecture.id}
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture.id === currentLecture?.id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : ""
                } `}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture.id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture.lecture_title}{" "}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture.id) && (
                    <Badge
                      variant={"outline"}
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
