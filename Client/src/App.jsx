import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/student/HeroSection";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { RouterProvider } from "react-router";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/Mylearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path:"login",
        element:<Login/>
      },
      {
        path:"learning",
        element:<MyLearning/>
      },
      {
        path:"profile",
        element:<Profile/>
      },

      //Admin path starts from here
      {
        path:"admin",
        element:<Sidebar />,
        children: [
          {
            path:"dashboard",
            element:<Dashboard />
          },
          {
            path:"course",
            element: <CourseTable />
          },
          {
            path:"course/create",
            element: <AddCourse />
          },
          {
            path:"course/:id",
            element:<EditCourse />
          },
          {
            path:"course/:id/lectures",
            element:<CreateLecture />
          },
          {
            path:"course/:id/lectures/:lectureId",
            element:<EditLecture />
          }
        ]
      }
    ],
  },
]);

function App() {
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
