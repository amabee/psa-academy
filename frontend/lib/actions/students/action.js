"use server";
import axios from "axios";

const SECRET_KEY = process.env.SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_ROOT_URL;

// GET COURSE DATA

export const getCourses = async (user_id) => {
  try {
    const res = await axios(`${BASE_URL}student/process/course.php`, {
      method: "GET",
      params: {
        operation: "getCourses",
        json: JSON.stringify({
          user_id: user_id,
        }),
      },

      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status error" };
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

export const getUserCourseDetails = async (user_id, course_id) => {
  try {
    const res = await axios(`${BASE_URL}student/process/course.php`, {
      method: "GET",
      params: {
        operation: "getUserCourseDetails",
        json: JSON.stringify({
          user_id: user_id,
          course_id: course_id,
        }),
      },

      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status error" };
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

// ADD TOPIC PROGRESS

export const addToTopicProgress = async (topic_id, user_id) => {
  const formData = new FormData();
  formData.append("operation", "addToTopicProgress");
  formData.append(
    "json",
    JSON.stringify({
      topic_id: topic_id,
      user_id: user_id,
    })
  );

  try {
    const res = await axios(`${BASE_URL}student/process/topics.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (![200, 201].includes(res.status)) {
      return {
        success: false,
        data: [],
        message: `Status error: ${res.status}`,
      };
    }

    return { success: true, data: res.data.data, message: res.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching courses";
    return { success: false, data: [], message: errorMessage };
  }
};

// UPDATE TOPIC PROGRESS

export const updateTopicProgress = async (topic_id) => {
  const formData = new FormData();
  formData.append("operation", "updateTopicProgress");
  formData.append(
    "json",
    JSON.stringify({
      topic_id: topic_id,
    })
  );

  try {
    const res = await axios(`${BASE_URL}student/process/topics.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 201) {
      return { success: false, data: [], message: "Status error" };
    }

    return { success: true, data: res.data.data, message: res.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching courses";
    return { success: false, data: [], message: errorMessage };
  }
};

// ENROLL COURSE

export const enrollCourse = async (user_id, course_id) => {
  const formData = new FormData();
  formData.append("operation", "enrollToCourse");
  formData.append(
    "json",
    JSON.stringify({
      user_id: user_id,
      course_id: course_id,
    })
  );

  try {
    const res = await axios(`${BASE_URL}student/process/course.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 201) {
      return { success: false, data: [], message: "Status error" };
    }

    return { success: true, data: res.data.data, message: res.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching courses";
    return { success: false, data: [], message: errorMessage };
  }
};
