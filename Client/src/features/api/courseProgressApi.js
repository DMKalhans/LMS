import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = "http://localhost:8080/api/v1/course-progress";

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    updateLectureProgress: builder.mutation({
      query: ({ id, lectureId }) => ({
        url: `/${id}/lecture/${lectureId}/view`,
        method: "POST",
      }),
    }),

    completeCourse: builder.mutation({
      query: (id) => ({
        url: `/${id}/complete`,
        method: "POST",
      }),
    }),
    inCompleteCourse: builder.mutation({
      query: (id) => ({
        url: `/${id}/incomplete`,
        method: "POST",
      }),
    }),
  }),
});
export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompleteCourseMutation,
  useInCompleteCourseMutation,
} = courseProgressApi;
