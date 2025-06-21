"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";
import { getCourseLessonContents } from "@/queries/student/student_course";
import { checkPreTestCompletion } from "@/lib/actions/students/action";

const CourseRedirect = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId;
  const user = useUser();
  const [isCheckingPreTest, setIsCheckingPreTest] = useState(true);
  
  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch,
  } = getCourseLessonContents(user?.user.user_id, courseId);

  useEffect(() => {
    const checkPreTestAndRedirect = async () => {
      if (!isLoading && course && user?.user?.user_id) {
        try {
          setIsCheckingPreTest(true);
          
          // Check if pre-test is completed
          const preTestStatus = await checkPreTestCompletion(
            user.user.user_id, 
            courseId
          );
          
          if (preTestStatus.success) {
            // If pre-test exists and is not completed, redirect to tests page
            if (preTestStatus.data.pre_test_exists && !preTestStatus.data.pre_test_completed) {
              router.push(`/student/courses/${courseId}/tests`, {
                scroll: false,
              });
              return;
            }
          }
          
          // If pre-test is completed or doesn't exist, proceed to first topic
          const firstChapter = course.lessons[0].topics[0]?.topic_id;
          if (firstChapter) {
            router.push(
              `/student/courses/${course.course_id}/topic/${firstChapter}`,
              {
                scroll: false,
              }
            );
          }
        } catch (error) {
          console.error("Error checking pre-test status:", error);
          // If there's an error, proceed to first topic as fallback
          const firstChapter = course.lessons[0].topics[0]?.topic_id;
          if (firstChapter) {
            router.push(
              `/student/courses/${course.course_id}/topic/${firstChapter}`,
              {
                scroll: false,
              }
            );
          }
        } finally {
          setIsCheckingPreTest(false);
        }
      }
    };

    checkPreTestAndRedirect();
  }, [isLoading, course, user, courseId, router]);

  if (isLoading || isCheckingPreTest) {
    return <div>Loading...</div>; // Show loading state
  }

  if (isError) {
    return <div>Error loading course</div>; // Handle error state
  }

  return <div>Redirecting...</div>; // Show something while redirecting
};

export default CourseRedirect;
