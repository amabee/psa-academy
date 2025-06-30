import { useQuery } from "@tanstack/react-query";

const { fetchAllCourses } = require("@/lib/actions/resource-person/action");

const fetchCourses = async () => {
  const { success, data, message } = await fetchAllCourses();
  if (!success) {
    throw new Error(message);
  }
  return data;
};

export const useCoursesResourceManager = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    retry: false,
  });
};
