import { Button } from "@/components/ui/button";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useGetInstructorCourseQuery } from "@/features/api/courseApi";
import { Loader2, Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function CourseTable() {
  const { data, isLoading } = useGetInstructorCourseQuery();
  const navigate = useNavigate();

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          My Courses
        </h1>
        <Button
          onClick={() => navigate("create")}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5"
        >
          + Create New Course
        </Button>
      </div>

      {/* Table */}
      <Table className="rounded-lg overflow-hidden">
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="w-[100px] text-gray-600 dark:text-gray-300">
              Price
            </TableHead>
            <TableHead className="text-gray-600 dark:text-gray-300">
              Status
            </TableHead>
            <TableHead className="text-gray-600 dark:text-gray-300">
              Title
            </TableHead>
            <TableHead className="text-right text-gray-600 dark:text-gray-300">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.courses.map((course) => (
            <TableRow
              key={course.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                {course.course_price ? `$${course.course_price}` : "—"}
              </TableCell>
              <TableCell>
                <Badge
                  className={`${
                    course.is_published
                      ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  } px-3 py-1 rounded-full font-medium`}
                >
                  {course.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100">
                {course.course_title}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick = {() => (navigate(`${course.id}`))}
                >
                  <Edit3 className="w-4 h-4 mr-2" /> Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Caption */}
      {data.courses.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No courses found. Create your first course!
        </p>
      )}
    </div>
  );
}

export default CourseTable;
