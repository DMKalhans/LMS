import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API =
  "https://lmsdeploy-t2vu.onrender.com/api/v1/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (id) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { id },
      }),
    }),
    getCourseDetailWithStatus: builder.query({
      query: (id) => ({
        url: `/course/${id}/detail-with-status`,
        method: "GET",
      }),
    }),
    getPurchasedCourses: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery,
} = purchaseApi;
