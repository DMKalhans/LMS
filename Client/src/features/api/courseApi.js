import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_URL = "http://localhost:8080/api/v1/course/";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Instructor_courses", "Refetch_lectures"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (inputData) => ({
        url: "",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["Refetch_Instructor_courses"],
    }),
    getInstructorCourse: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch_Instructor_courses"],
    }),
    editCourse: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Instructor_courses"],
    }),
    getCourseById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    createLecture: builder.mutation({
      query: ({ lectureTitle, id }) => ({
        url: `/${id}/lectures`,
        method: "POST",
        body: { lectureTitle },
      }),
    }),
    getCourseLecture: builder.query({
      query: (id) => ({
        url: `/${id}/lectures`,
        method: "GET",
      }),
      providesTags: ["Refetch_lectures"],
    }),
    editLecture: builder.mutation({
      query: (inputBody) => ({
        url: `/${inputBody.id}/lectures/${inputBody.lectureId}`,
        method: "POST",
        body: inputBody,
      }),
      invalidatesTags: ["Refetch_lectures"],
    }),
    removeLecture: builder.mutation({
      query: (inputBody) => ({
        url: `/${inputBody.id}/lectures/${inputBody.lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_lectures"],
    }),
    getLectureById: builder.query({
      query: (inputBody) => ({
        url: `/${inputBody.id}/lectures/${inputBody.lectureId}`,
        method: "GET",
      }),
    }),
    publishCourse: builder.mutation({
      query: ({ id, query }) => ({
        url: `/${id}?publish=${query}`,
        method: "PATCH",
      }),
    }),
    getPublishedCourses: builder.query({
      query: () => ({
        url: `/published-courses`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetInstructorCourseQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,
  useGetPublishedCoursesQuery,
} = courseApi;
