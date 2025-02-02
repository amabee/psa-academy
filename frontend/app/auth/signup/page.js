"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { signup } from "@/lib/actions/auth";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [signingUp, setSigningUp] = useState(false);

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

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  const validatePhilippinePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s\-()]/g, "");

    const mobilePattern = /^(\+63|0)9\d{9}$/;

    if (mobilePattern.test(cleanPhone)) {
      return true;
    }

    return false;
  };

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    username: "",
    birthday: "",
    gender: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "username",
      "birthday",
      "gender",
      "password",
      "confirmPassword",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone number validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (formData.phoneNumber) {
      if (!validatePhilippinePhone(formData.phoneNumber)) {
        newErrors.phoneNumber =
          "Please enter a valid Philippine phone number (e.g., +63 917 123 4567 or 0917 123 4567)";
      }
    }

    // Password validation
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter";
      } else if (!/(?=.*[0-9])/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      }
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!formData.terms) {
      newErrors.terms = "You must accept the Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setSigningUp(true);

        const { success, data, message } = await signup(
          formData.firstName,
          formData.middleName,
          formData.lastName,
          formData.email,
          formData.username,
          formData.phoneNumber,
          formData.birthday,
          formData.gender,
          formData.confirmPassword
        );

        if (!success) {
          Swal.fire({
            title: "Uh oh",
            text: message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            backdrop: true,
            confirmButtonText: "OK",
            icon: "error",
          });
        } else {
          let timerInterval;
          Swal.fire({
            title: "Yahoo!",
            html: `${message}<br><br><b>Redirecting to login page in <span class="countdown">5</span> seconds...</b>`,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            backdrop: true,
            confirmButtonText: "OK",
            icon: "success",
            timer: 5000, // 5 seconds
            timerProgressBar: true,
            didOpen: () => {
              const countdown = Swal.getPopup().querySelector(".countdown");
              timerInterval = setInterval(() => {
                countdown.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
              window.location.href = "/auth/signin";
            },
          });
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          submit: "Registration failed. Please try again.",
        }));
      } finally {
        setSigningUp(false);
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          username: "",
          birthday: "",
          gender: "",
          password: "",
          confirmPassword: "",
          terms: false,
        });
      }
    }
  };

  return (
    <div className="font-[sans-serif]">
      <div className="grid lg:grid-cols-2 md:grid-cols-2 items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-md:order-1 h-screen min-h-full"
        >
          <img
            src="https://opendoodles.s3-us-west-1.amazonaws.com/sitting-reading.svg"
            className="w-full h-full object-fit"
            alt="register-image"
          />
        </motion.div>

        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="max-w-xl w-full p-6 mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="text-gray-800 text-4xl font-extrabold">
              Create Account
            </h3>
            <p className="text-gray-800 text-sm mt-6">
              Already have an account?
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/auth/signin"
                className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
              >
                Sign in here
              </motion.a>
            </p>
          </motion.div>

          {/* First Name */}
          <motion.div variants={itemVariants}>
            <label className="text-gray-800 text-sm block mb-2">
              First Name
            </label>
            <div className="relative flex items-center">
              <input
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter your first name"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </motion.div>

          {/* Middle Name */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">
              Middle Name
            </label>
            <div className="relative flex items-center">
              <input
                name="middleName"
                type="text"
                value={formData.middleName}
                onChange={handleInputChange}
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter your middle name"
              />
            </div>
          </motion.div>

          {/* Last Name */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">
              Last Name
            </label>
            <div className="relative flex items-center">
              <input
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter your last name"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">Email</label>
            <div className="relative flex items-center">
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter email address"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </motion.div>

          {/* Phone Number */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <input
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="0917 123 4567 or +63 917 123 4567"
                pattern="^(\+63|0)9\d{9}$"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </motion.div>

          {/* Username */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">Username</label>
            <div className="relative flex items-center">
              <input
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Choose a username"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </motion.div>

          {/* Birthday */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">Birthday</label>
            <div className="relative flex items-center">
              <input
                name="birthday"
                type="date"
                required
                value={formData.birthday}
                onChange={handleInputChange}
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
              />
            </div>
            {errors.birthday && (
              <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>
            )}
          </motion.div>

          {/* Gender */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">Gender</label>
            <div className="relative flex items-center">
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none bg-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-say">Prefer not to say</option>
              </select>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">Password</label>
            <div className="relative flex items-center">
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Create password"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Confirm password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center mt-6"
          >
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              checked={formData.terms}
              onChange={handleInputChange}
              className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-3 block text-sm text-gray-800">
              I agree to the
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="javascript:void(0);"
                className="text-blue-600 font-semibold hover:underline ml-1"
              >
                Terms & Conditions
              </motion.a>
            </label>
          </motion.div>
          {errors.terms && (
            <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
          )}

          {errors.submit && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {errors.submit}
            </p>
          )}

          <motion.div variants={itemVariants} className="mt-12">
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              type="submit"
              disabled={signingUp}
              className="relative w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium tracking-wide rounded-md text-white-100 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {signingUp && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{signingUp ? "Signing Up..." : "Create Account"}</span>
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}
