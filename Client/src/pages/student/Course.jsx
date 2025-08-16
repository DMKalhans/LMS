import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({ data }) => {
  if (!data) {
    console.error("data is undefined");
    return (
      <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg p-4">
        <div className="text-center text-gray-500">
          <p>Course data not available</p>
        </div>
      </Card>
    );
  }
  const course = data.course;
  const instructor = data.instructor;

  return (
    <Link to={`/course-detail/${course.id}`}>
      <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="relative">
          <img
            src={course.course_thumbnail}
            alt="course"
            className="w-full h-36 object-cover rounded-t-lg"
          />
        </div>
        <CardContent className="px-5 py-4 space-y-3">
          <h1 className="hover:underline font-bold text-lg truncate">
            {course.course_title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={instructor.photo_url || "https://github.com/shadcn.png"}
                  alt="@instructor"
                />
                <AvatarFallback>
                  {instructor.name
                    ? instructor.name.charAt(0).toUpperCase()
                    : "I"}
                </AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-sm">{instructor.name}</h1>
            </div>
            <Badge
              className={
                "bg-blue-600 text-white px-2 py-1 text-xs rounded-full"
              }
            >
              {course.course_level}
            </Badge>
          </div>
          <div className="text-lg font-bold">
            <span>₹{course.course_price}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
