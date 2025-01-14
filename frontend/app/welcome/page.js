"use client"
import { motion } from "framer-motion";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, GraduationCap, BookOpen } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent">
      {/* Background Pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-6xl"
        >
          <div className="flex flex-col items-center space-y-8 text-center">
            {/* Announcement Banner */}
            <motion.div
              variants={itemVariants}
              className="rounded-full bg-white/90 px-6 py-2 shadow-lg backdrop-blur-sm"
            >
              <AnimatedGradientText>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🎉</span>
                  <div className="h-4 w-px bg-gray-300" />
                  <span
                    className={cn(
                      "inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent"
                    )}
                  >
                    Introducing PSA-Academy
                  </span>
                  <ChevronRight className="size-4 text-gray-600" />
                </div>
              </AnimatedGradientText>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                <span className="bg-gradient-to-b from-[#000000] to-[#474747] bg-clip-text text-transparent">
                  Welcome to PSA-Academy
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-base text-gray-600 sm:text-lg md:text-xl">
                Explore PSA-Academy to discover all the tools and features
                designed to empower your learning experience. If you ever need
                assistance, our support team is just a click away.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button className="group h-11 px-6 text-base" size="lg">
                <span>Get Started</span>
                <GraduationCap className="ml-2 size-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                className="group h-11 px-6 text-base"
                variant="outline"
                size="lg"
              >
                <span>Learn More</span>
                <BookOpen className="ml-2 size-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}