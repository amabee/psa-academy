import { getCourseStudents } from "@/lib/actions/speaker/action";
import { useMutation, useQuery } from "@tanstack/react-query";

const fetchCourseStudents = async (course_id) => {
  const { success, data, message } = await getCourseStudents(course_id);
  if (!success) {
    throw new Error(message);
  }
  return data;
};

export const useCourseStudents = (course_id) => {
  return useQuery({
    queryKey: ["courseStudents", course_id],
    queryFn: () => fetchCourseStudents(course_id),
    retry: false,
    enabled: !!course_id,
  });
};
