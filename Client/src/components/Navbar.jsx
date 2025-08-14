import { Menu, School } from "lucide-react";
import { React, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

function Navbar() {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-4">
        <div className="flex items-center gap-2">
          <div className="relative p-2 rounded-2xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-fuchsia-500 shadow-[0_4px_14px_rgba(79,70,229,0.4)]" />

            <div className="absolute inset-0 rounded-2xl bg-white/10 [mask-image:radial-gradient(120%_80% at 10% 0%,#000_30%,transparent_60%)]" />
            <School
              size={22}
              className="relative text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
            />
          </div>

          <h1 className="font-extrabold text-2xl tracking-tight flex">
            <span className="text-neutral-900 dark:text-white">
              <Link to="/">Skill</Link>
            </span>
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-fuchsia-500 bg-clip-text text-transparent">
              <Link to="/">Forge</Link>
            </span>
          </h1>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                  <AvatarImage
                    src={
                      user?.photo_url ||
                      "https://i.pinimg.com/736x/4e/0d/7e/4e0d7e9b5e0f542fd4f68715554f1c98.jpg"
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <Link to="/learning">
                    <DropdownMenuItem>My Learning</DropdownMenuItem>
                  </Link>
                  <Link to="/profile">
                    <DropdownMenuItem>My Profile</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center justify-center font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition">
                      <Link to="/dashboard">Go to Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hover:bg-indigo-50 hover:text-indigo-700 transition-all"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white hover:brightness-110 transition-all"
                onClick={() => navigate("/login")}
              >
                Signup
              </Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
            <School size={20} className="text-white" />
          </div>
          <h1 className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-700">
            SkillForge
          </h1>
        </div>
        <MobileNavbar />
      </div>
    </div>
  );
}

export default Navbar;

const MobileNavbar = () => {
  const role = "instructor";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-5">
          <SheetTitle className="font-extrabold text-2xl">
            SkillForge
          </SheetTitle>
          <DarkMode />
        </SheetHeader>

        <Separator className="my-4" />

        <nav className="flex flex-col gap-4 px-4 text-gray-700 dark:text-gray-200 font-medium">
          <Link to="/learning">My Learning</Link>
          <Link to="/profile">My Profile</Link>
          <Link to="/logout">Logout</Link>
        </nav>

        {role === "instructor" && (
          <SheetFooter className="mt-auto flex flex-col gap-2 px-4 mb-4">
            <Link
              to="/dashboard"
              className="w-full text-center bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition"
            >
              Instructor Dashboard
            </Link>
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Close Menu
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
