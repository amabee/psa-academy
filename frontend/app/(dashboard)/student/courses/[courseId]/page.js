"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";
import { getCourseLessonContents } from "@/queries/student/student_course";

const CourseRedirect = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId;
  const user = useUser();
  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch,
  } = getCourseLessonContents(user?.user.user_id, courseId);

  useEffect(() => {
    if (!isLoading && course) {
      const firstChapter = course.lessons[0].topics[0]?.topic_id;
      router.push(
        `/student/courses/${course.course_id}/topic/${firstChapter}`,
        {
          scroll: false,
        }
      );
    }
  }, [isLoading, course, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (isError) {
    return <div>Error loading course</div>; // Handle error state
  }

  return <div>Redirecting...</div>; // Show something while redirecting
};

export default CourseRedirect;
