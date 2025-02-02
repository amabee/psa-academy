import { getCourses } from "@/lib/actions/students/action";
import { useMutation, useQuery } from "@tanstack/react-query";

const fetchCourses = async (user_id) => {
  const { success, data, message } = await getCourses(user_id);
  if (!success) {
    throw new Error(message || "Failed to fetch courses");
  }

  console.log("FETCHED DATA: ", data);
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
