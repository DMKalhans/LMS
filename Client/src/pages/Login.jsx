import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPwdSignup, setShowPwdSignup] = useState(false);
  const [showPwdLogin, setShowPwdLogin] = useState(false);

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },  
  ] = useRegisterUserMutation();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput((s) => ({ ...s, [name]: value }));
    } else {
      setLoginInput((s) => ({ ...s, [name]: value }));
    }
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Account created successfully.");
      navigate("/login");
    }
    if (registerError) {
      toast.error(
        registerError?.data?.message || "Error while creating account."
      );
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Logged in successfully.");
      navigate("/");
    }
    if (loginError) {
      toast.error(loginError?.data?.message || "Login failed.");
    }
  }, [
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
    navigate,
  ]);

  return (
    <div className="relative">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.12),transparent_60%)]" />

      <div className="flex items-center w-full justify-center mt-20">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Tabs defaultValue="login">
            <TabsList className="flex w-full">
              <TabsTrigger
                value="signup"
                className="flex-1 py-2 text-center data-[state=active]:border-b-2 data-[state=active]:border-gray-100"
              >
                Signup
              </TabsTrigger>
              <TabsTrigger
                value="login"
                className="flex-1 py-2 text-center data-[state=active]:border-b-2 data-[state=active]:border-gray-100"
              >
                Login
              </TabsTrigger>
            </TabsList>

            {/* ---------- SIGNUP ---------- */}
            <TabsContent value="signup">
              <div className="mx-auto mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <Card className="border-0 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/70 rounded-2xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Create your account
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Start learning in under a minute.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-5">
                  {/* Name */}
                  <div className="grid gap-2">
                    <Label>Name</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="name"
                        value={signupInput.name}
                        placeholder="Jane Doe"
                        className="pl-10"
                        onChange={(e) => changeInputHandler(e, "signup")}
                        required
                      />
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 21a8 8 0 10-16 0"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="12"
                            cy="7"
                            r="4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Input
                        type="email"
                        name="email"
                        value={signupInput.email}
                        placeholder="you@example.com"
                        className="pl-10"
                        onChange={(e) => changeInputHandler(e, "signup")}
                        required
                      />
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M4 6h16v12H4z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M4 7l8 6 8-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="grid gap-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        type={showPwdSignup ? "text" : "password"}
                        name="password"
                        value={signupInput.password}
                        placeholder="At least 8 characters"
                        className="pl-10 pr-12"
                        onChange={(e) => changeInputHandler(e, "signup")}
                        required
                      />
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 17a5 5 0 100-10 5 5 0 000 10z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPwdSignup((s) => !s)}
                        className="absolute inset-y-0 right-2 flex items-center rounded-md px-2 text-xs text-muted-foreground hover:text-foreground"
                        aria-label="Toggle password visibility"
                      >
                        {showPwdSignup ? "Hide" : "Show"}
                      </button>
                    </div>

                    {/* simple strength hint */}
                    <div className="h-1 rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${
                          signupInput.password.length >= 10
                            ? "w-4/4 bg-emerald-500"
                            : signupInput.password.length >= 8
                            ? "w-3/4 bg-amber-500"
                            : signupInput.password.length >= 6
                            ? "w-2/4 bg-green-300"
                            : "w-1/5 bg-red-500"
                        }`}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col items-start gap-3">
                  <Button
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:opacity-95"
                    disabled={registerIsLoading}
                    onClick={() => handleRegistration("signup")}
                  >
                    {registerIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Creating account…
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* ---------- LOGIN ---------- */}
            <TabsContent value="login">
              <div className="mx-auto mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <Card className="border-0 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/70 rounded-2xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Welcome back
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Enter your credentials to continue.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-5">
                  {/* Email */}
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Input
                        type="email"
                        name="email"
                        value={loginInput.email}
                        required
                        placeholder="you@example.com"
                        className="pl-10"
                        onChange={(e) => changeInputHandler(e, "login")}
                      />
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M4 6h16v12H4z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M4 7l8 6 8-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="grid gap-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        type={showPwdLogin ? "text" : "password"}
                        name="password"
                        value={loginInput.password}
                        required
                        placeholder="Your password"
                        className="pl-10 pr-12"
                        onChange={(e) => changeInputHandler(e, "login")}
                      />
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 17a5 5 0 100-10 5 5 0 000 10z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPwdLogin((s) => !s)}
                        className="absolute inset-y-0 right-2 flex items-center rounded-md px-2 text-xs text-muted-foreground hover:text-foreground"
                        aria-label="Toggle password visibility"
                      >
                        {showPwdLogin ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col items-start gap-3">
                  <Button
                    disabled={loginIsLoading}
                    onClick={() => handleRegistration("login")}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:opacity-95"
                  >
                    {loginIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Signing you in…
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
