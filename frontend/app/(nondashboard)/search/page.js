"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const SearchCourse = () => {
  const [email, setEmail] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <Card className="p-6 text-center shadow-2xl border-none bg-white/80 backdrop-blur-lg">
          <motion.div variants={itemVariants}>
            <CardHeader className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              >
                <Zap
                  className="h-20 w-20 text-yellow-500 animate-pulse"
                  strokeWidth={1.5}
                />
              </motion.div>
              <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Feature Coming Soon
              </CardTitle>
            </CardHeader>
          </motion.div>

          <motion.div variants={itemVariants}>
            <CardContent>
              <p className="text-gray-700 mb-6 text-lg">
                Get ready for an epic course search experience! Be the first to
                know when we launch.
              </p>

              <div className="flex space-x-2 mb-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Notify Me
                </Button>
              </div>

              <p className="text-xs text-gray-500 italic">
                * We promise not to spam you
              </p>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SearchCourse;
