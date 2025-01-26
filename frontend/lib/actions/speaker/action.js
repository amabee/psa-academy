"use server";
import axios from "axios";

const SECRET_KEY = process.env.SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_ROOT_URL;

// GET COURSE DATAS

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

// COURSE CUD OPERATIONS

export const createCourse = async (course_id, user_id) => {
  const formData = new FormData();
  formData.append("operation", "createCourse");
  formData.append(
    "json",
    JSON.stringify({ course_id: course_id, user_id: user_id })
  );
  try {
    const res = await axios(`${BASE_URL}speaker/process/courses.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 201 || res.statusText !== "Created") {
      return { success: false, data: [], message: "Status Error" };
    }

    if (res.success == false) {
      return {
        success: false,
        data: [],
        message: "Something went wrong creating course",
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

export const updateCourse = async (
  course_id,
  user_id,
  title,
  description,
  category_id,
  course_status,
  course_image
) => {
  try {
    const formData = new FormData();
    formData.append("operation", "updateCourse");

    const jsonData = {
      course_id: course_id,
      user_id: user_id,
      category_id: category_id,
      title: title,
      description: description,
      course_status: course_status,
    };

    formData.append("json", JSON.stringify(jsonData));

    if (course_image !== null) {
      formData.append("course_image", course_image);
    }

    const res = await axios(`${BASE_URL}speaker/process/courses.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data: res.data,
      message: "Course updated successfully",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred updating the course";
    return {
      success: false,
      data: [],
      message: errorMessage,
    };
  }
};

export const deleteCourse = async (course_id) => {
  try {
    const res = await axios.delete(`${BASE_URL}speaker/process/courses.php`, {
      headers: {
        Authorization: SECRET_KEY,
      },
      data: {
        operation: "removeCourse",
        json: JSON.stringify({
          course_id: course_id,
        }),
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status Error" };
    }

    if (res.success == false) {
      return {
        success: false,
        data: [],
        message: "Something went wrong deleting course",
      };
    }

    return { success: true, data: res.data.message, message: "" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while removing the course";
    return { success: false, data: [], message: errorMessage };
  }
};

// GET LESSONS DATAS

export const getLessonDetails = async (lesson_id) => {
  try {
    const res = await axios(`${BASE_URL}speaker/process/lessons.php`, {
      method: "GET",
      params: {
        operation: "getLessonDetail",
        json: JSON.stringify({
          lesson_id: lesson_id,
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
      "An error occurred while fetching lesson detail";
    return { success: false, data: [], message: errorMessage };
  }
};

export const generateLessonID = async () => {
  try {
    const res = await axios(`${BASE_URL}speaker/process/lessons.php`, {
      method: "GET",
      params: {
        operation: "generateLessonID",
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
        message: "Something went wrong generating lesson id",
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

// LESSON CUD OPERATIONS

export const createLesson = async (lesson_id, course_id, description) => {
  const formData = new FormData();
  formData.append("operation", "createLesson");
  formData.append(
    "json",
    JSON.stringify({
      lesson_id: lesson_id,
      course_id: course_id,
      description: description,
    })
  );
  try {
    const res = await axios(`${BASE_URL}speaker/process/lessons.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 201 || res.statusText !== "Created") {
      return { success: false, data: [], message: "Status Error" };
    }

    if (res.success == false) {
      return {
        success: false,
        data: [],
        message: "Something went wrong creating lesson",
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
