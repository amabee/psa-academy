import {
  getCourses,
  getUserCourseDetails,
} from "@/lib/actions/students/action";
import { useMutation, useQuery } from "@tanstack/react-query";

const fetchCourses = async (user_id) => {
  const { success, data, message } = await getCourses(user_id);
  if (!success) {
    throw new Error(message || "Failed to fetch courses");
  }
  return data;
};

const fetchUserCourseDetails = async (user_id, course_id) => {
  const { success, data, message } = await getUserCourseDetails(
    user_id,
    course_id
  );

  if (!success) {
    throw new Error(message || "Failed to fetch course detail and lessons");
  }

  return data;
};

export const getUserCourse = (user_id) => {
  return useQuery({
    queryKey: ["courses", user_id],
    queryFn: () => fetchCourses(user_id),
    enabled: !!user_id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error("Failed to fetch courses:", error);
    },
  });
};

export const getCourseLessonContents = (user_id, course_id) => {
  return useQuery({
    queryKey: ["course_details", user_id, course_id],
    queryFn: () => fetchUserCourseDetails(user_id, course_id),
    enabled: !!user_id && !!course_id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error("Failed to fetch course details:", error);
    },
  });
};
