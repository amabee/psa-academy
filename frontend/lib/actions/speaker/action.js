"use server";
import axios from "axios";

const SECRET_KEY = process.env.SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export const getCourses = async () => {
  try {
    const res = await axios(`${BASE_URL}speaker/process/courses.php`, {
      method: "GET",
      params: {
        operation: "getCourses",
        json: JSON.stringify([]),
      },

      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Stats error" };
    }

    return { success: true, data: res.data.data, message: "" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching courses";
    return { success: false, data: [], message: errorMessage };
  }
};

export const getCourseDetails = async (course_id) => {
  try {
    const res = await axios(`${BASE_URL}speaker/process/courses.php`, {
      method: "GET",
      params: {
        operation: "getCourseDetail",
        json: JSON.stringify({
          course_id: course_id,
        }),
      },

      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Stats error" };
    }

    return { success: true, data: res.data.data, message: "" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching course detail";
    return { success: false, data: [], message: errorMessage };
  }
};

export const generateCourseID = async () => {
  try {
    const res = await axios(`${BASE_URL}speaker/process/courses.php`, {
      method: "GET",
      params: {
        operation: "generateCourseID",
        json: JSON.stringify([]),
      },

      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status error" };
    }

    if (res.success == false) {
      return {
        success: false,
        data: [],
        message: "Something went wrong generating course id",
      };
    }

    return { success: true, data: res.data.message, message: "" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during login";
    return { success: false, data: [], message: errorMessage };
  }
};

export const getCategories = async () => {
  try {
    const res = await axios(`${BASE_URL}speaker/process/categories.php`, {
      method: "GET",
      params: {
        operation: "getCategories",
        json: JSON.stringify([]),
      },

      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Stats error" };
    }

    if (res.success == false) {
      return {
        success: false,
        data: [],
        message: "Something went wrong generating course id",
      };
    }

    return { success: true, data: res.data.data, message: "" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error while fetching categories";
    return { success: false, data: [], message: errorMessage };
  }
};
