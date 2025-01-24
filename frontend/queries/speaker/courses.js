import { useMutation, useQuery } from "@tanstack/react-query";
import {
  generateCourseID,
  getCategories,
  getCourseDetails,
  getCourses,
} from "@/lib/actions/speaker/action";

const fetchCourses = async () => {
  const { success, data, message } = await getCourses();
  if (!success) {
    throw new Error(message);
  }
  return data;
};

const fetchCourseDetails = async (course_id) => {
  const { success, data, message } = await getCourseDetails(course_id);
  if (!success) {
    throw new Error(message);
  }
  return data;
};

const fetchCategories = async () => {
  const { success, data, message } = await getCategories();
  if (!success) {
    throw new Error(message);
  }
  return data;
};

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    retry: false,
  });
};

export const useCourseDetail = (courseId) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseDetails(courseId),
    enabled: !!courseId,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};
