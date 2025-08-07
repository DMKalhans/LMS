import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

function Course() {
  return (
    <Card className="overflow-hidden rounded-xl dark:bg-gray-900 bg-white shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.01] duration-300 p-0 w-[300px]">
      <img
        src="https://codewithmosh.com/_next/image?url=https%3A%2F%2Fuploads.teachablecdn.com%2Fattachments%2F0dKhU49vRbiSSWknbHAR_1920X1357.jpg&w=3840&q=75"
        alt="course"
        className="w-full h-40 object-cover"
      />

      <CardContent className="px-4 py-2 -mt-4 space-y-2">
        <h2 className="text-medium font-bold text-gray-900 dark:text-white truncate ">
          Learn Next JS
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src="https://pokestop.io/img/pokemon/psyduck-256x256.png"
                alt="instructor"
              />
              <AvatarFallback>IN</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
              Instructor Name
            </span>
          </div>

          <Badge className="bg-blue-600 text-white px-2 py-0.5 text-[10px] rounded-full">
            Beginner
          </Badge>
        </div>
        <span className="text-sm font-bold text-green-700 dark:text-green-400">
          ₹499
        </span>
      </CardContent>
    </Card>
  );
}

export default Course;
