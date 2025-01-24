"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { login } from "@/lib/actions/auth";
import { useAppStore } from "@/store/stateStore";
import Swal from "sweetalert2";
import { LoadingOverlay } from "@/components/shared/loadingoverlay";

export default function LoginPage() {
  const [isViewPassword, setIsViewPassword] = useState(false);
  const [inputType, setInputType] = useState("password");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const isRedirecting = useAppStore((state) => state.isRedirecting);
  const setIsRedirecting = useAppStore((state) => state.setIsRedirecting);

  const handleViewPassword = () => {
    setIsViewPassword(!isViewPassword);
    setInputType(!isViewPassword ? "text" : "password");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { success, message, data } = await login(user, password);

      if (!success) {
        Swal.fire({
          title: "Error",
          text: message,
          icon: "error",
          confirmButtonText: "Retry",
        });
        return;
      }
      localStorage.setItem("user", JSON.stringify(data.data.user));

      setIsRedirecting(true);
      const userType = data.data.user.userType_id;

      switch (userType) {
        case 1:
          return (window.location.href = "/welcome");
        case 2:
          return (window.location.href = "/welcome");
        case 3:
          return (window.location.href = "/speaker/courses");
        case 4:
          return (window.location.href = "/student/courses");
        default:
          return (window.location.href = "/dashboard");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "An error occurred",
        icon: "error",
        confirmButtonText: "Ok",
      });
      setIsRedirecting(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading overlay when redirecting
  if (isRedirecting) {
    return <LoadingOverlay />;
  }

  return (
    <div className="font-[sans-serif] overflow-hidden">
      <div className="grid lg:grid-cols-2 md:grid-cols-2 items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-md:order-1 h-screen min-h-full"
        >
          <img
            src="https://opendoodles.s3-us-west-1.amazonaws.com/swinging.svg"
            className="w-full h-full object-cover"
            alt="login-image"
          />
        </motion.div>

        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl w-full p-6 mx-auto"
          onSubmit={handleLogin}
        >
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-gray-800 text-4xl font-extrabold">Sign in</h3>
            <p className="text-gray-800 text-sm mt-6">
              Don't have an account
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/auth/signup"
                className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
              >
                Register here
              </motion.a>
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <label className="text-gray-800 text-sm block mb-2">Email</label>
            <div className="relative flex items-center">
              <input
                name="email"
                type="text"
                required
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter email or username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#bbb"
                stroke="#bbb"
                className="w-[18px] h-[18px] absolute right-2"
                viewBox="0 0 682.667 682.667"
              >
                <defs>
                  <clipPath id="a" clipPathUnits="userSpaceOnUse">
                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                  </clipPath>
                </defs>
                <g
                  clipPath="url(#a)"
                  transform="matrix(1.33 0 0 -1.33 0 682.667)"
                >
                  <path
                    fill="none"
                    strokeMiterlimit="10"
                    strokeWidth="40"
                    d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                    data-original="#000000"
                  ></path>
                  <path
                    d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                    data-original="#000000"
                  ></path>
                </g>
              </svg>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">Password</label>
            <div className="relative flex items-center">
              <input
                name="password"
                type={inputType}
                required
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 pr-10 outline-none transition-colors"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleViewPassword}
              >
                {isViewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                )}
                <span className="sr-only">
                  {isViewPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="mt-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}
