"use client";

import Toolbar from "@/components/shared/toolbar";
import CourseCard from "@/components/shared/coursecard";
import { useRouter } from "next/navigation";
import Header from "@/components/shared/header";
import { useState, useMemo } from "react";
import { useUser } from "@/app/providers/UserProvider";
import { getUserCourse } from "@/queries/student/student_course";
import Loading from "@/components/shared/loading";
import LoadingOverlay from "@/components/shared/loadingoverlay";
import { enrollCourse, checkPreTestCompletion } from "@/lib/actions/students/action";
import { toast } from "sonner";

const Courses = () => {
  const router = useRouter();
  const user = useUser();

  const [isRedirecting, setIsRedirecting] = useState(false);

  const [enrolling, setEnrolling] = useState(false);

  const {
    data: courses,
    isLoading,
    isError,
    error,
    refetch,
  } = getUserCourse(user?.user.user_id);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.map((course) => ({
      ...course,
      isAdmitted: course.isAdmitted,
    })).filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  const handleGoToCourse = async (course) => {
    if (course.enrolled !== 1) {
      return;
    }

    try {
      setIsRedirecting(true);
      
      // Check if pre-test is completed
      const preTestStatus = await checkPreTestCompletion(
        user?.user.user_id,
        course.course_id
      );
      
      if (preTestStatus.success) {
        // If pre-test exists and is not completed, redirect to tests page
        if (preTestStatus.data.pre_test_exists && !preTestStatus.data.pre_test_completed) {
          router.push(`/student/courses/${course.course_id}/tests`, {
            scroll: false,
          });
          return;
        }
      }
      
      // If pre-test is completed or doesn't exist, proceed to first topic
      if (
        course.lessons &&
        course.lessons.length > 0 &&
        course.lessons[0].topics.length > 0
      ) {
        const firstChapter = course.lessons[0].topics[0];
        router.push(
          `/student/courses/${course.course_id}/topic/${firstChapter}`,
          {
            scroll: false,
          }
        );
      } else {
        router.push(`/student/courses/${course.course_id}`, {
          scroll: false,
        });
      }
    } catch (error) {
      console.error("Error checking pre-test status:", error);
      // If there's an error, proceed to first topic as fallback
      if (
        course.lessons &&
        course.lessons.length > 0 &&
        course.lessons[0].topics.length > 0
      ) {
        const firstChapter = course.lessons[0].topics[0];
        router.push(
          `/student/courses/${course.course_id}/topic/${firstChapter}`,
          {
            scroll: false,
          }
        );
      } else {
        router.push(`/student/courses/${course.course_id}`, {
          scroll: false,
        });
      }
    }
  };

  const onApplyCourse = async (course) => {
    try {
      setEnrolling(true);

      const { success, data, message } = await enrollCourse(
        user?.user.user_id,
        course.course_id
      );

      if (!success) {
        toast.error(message);
        return;
      }
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEnrolling(false);
      refetch();
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-center">
        Please sign in to view your courses.
      </div>
    );
  }

  if (isRedirecting) {
    return <LoadingOverlay />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        Error loading courses:{" "}
        {error?.message || "Please try to refresh the page"}
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="p-4 text-center">
        You are not enrolled in any courses yet.
      </div>
    );
  }

  return (
    <div className="user-courses">
      <Header title="My Courses" subtitle="View your enrolled courses" />
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      <div className="user-courses__grid">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.course_id}
            course={course}
            onGoToCourse={handleGoToCourse}
            onApplyCourse={onApplyCourse}
            enrolling={enrolling}
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;
