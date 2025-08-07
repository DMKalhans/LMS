import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

function Profile() {
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [newName, setNewName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateProfileHandler = async () => {
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "Profile updated.");
    }
    if (isError) {
      toast.error(error.message || "Failed to update profile");
    }
  }, [error, updateUserData, isSuccess, isError]);

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  const { name, email, role, photo_url, courses } = data.user;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 my-24 space-y-12">
      {/* PROFILE SECTION */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 grid md:grid-cols-3 gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center justify-start gap-4 md:col-span-1">
          <Avatar className="h-28 w-28 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-950 ring-blue-500">
            <AvatarImage
              src={
                photo_url ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV2kMZeVfGNRJdzUaADTJmDj79w6lDzgcXTA&s"
              }
              alt="profile"
            />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="mt-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
              >
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your name or avatar photo here.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex flex-col space-y-1">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label>Profile Photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={onChangeHandler}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={updateProfileHandler}
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please Wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Profile Details */}
        <div className="md:col-span-2 grid gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Name</span>
            <h2 className="text-lg font-semibold">{name}</h2>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Email</span>
            <h2 className="text-lg font-semibold">{email}</h2>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Role</span>
            <h2 className="text-lg font-semibold">{role.toUpperCase()}</h2>
          </div>
        </div>
      </div>

      {/* COURSES SECTION */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">📚 Enrolled Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {!courses || courses.length === 0 || courses[0] === null ? (
            <div className="text-sm text-gray-500 italic col-span-full">
              You haven’t enrolled in any course yet.
            </div>
          ) : (
            courses.map((courseId, index) => (
              <Course key={index} courseId={courseId} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
