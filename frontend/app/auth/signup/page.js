"use client";
import { motion } from "framer-motion";

export default function RegisterPage() {
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
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter your first name"
              />
            </div>
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
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter your last name"
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">Email</label>
            <div className="relative flex items-center">
              <input
                name="email"
                type="email"
                required
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter email address"
              />
            </div>
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
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Enter phone number"
              />
            </div>
          </motion.div>

          {/* Username */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">Username</label>
            <div className="relative flex items-center">
              <input
                name="username"
                type="text"
                required
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Choose a username"
              />
            </div>
          </motion.div>

          {/* Birthday */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">Birthday</label>
            <div className="relative flex items-center">
              <input
                name="birthday"
                type="date"
                required
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
              />
            </div>
          </motion.div>

          {/* Gender */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">Gender</label>
            <div className="relative flex items-center">
              <select
                name="gender"
                required
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none bg-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-say">Prefer not to say</option>
              </select>
            </div>
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">Password</label>
            <div className="relative flex items-center">
              <input
                name="password"
                type="password"
                required
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Create password"
              />
            </div>
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
                className="w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                placeholder="Confirm password"
              />
            </div>
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

          <motion.div variants={itemVariants} className="mt-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Create Account
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}
