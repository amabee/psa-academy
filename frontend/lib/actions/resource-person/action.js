"use server";
import axios from "axios";

const SECRET_KEY = process.env.SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export const fetchAllCourses = async () => {
  try {
    const res = await axios(`${BASE_URL}resource-person/process/courses.php`, {
      method: "GET",
      params: {
        operation: "getAllCourses",
        json: JSON.stringify({}),
      },

      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status error" };
    }

    console.log("DATA: ", res.data);

    return { success: true, data: res.data.data, message: "" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching courses";
    return { success: false, data: [], message: errorMessage };
  }
};
