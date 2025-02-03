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

const Courses = () => {
  const router = useRouter();
  const user = useUser();

  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = getUserCourse(user?.user.user_id);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  const handleGoToCourse = (course) => {
    console.log(course);

    if (
      course.lessons &&
      course.lessons.length > 0 &&
      course.lessons[0].topics.length > 0
    ) {
      setIsRedirecting(true);
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
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;
