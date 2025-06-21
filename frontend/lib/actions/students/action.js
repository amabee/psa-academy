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

export const updateTopicProgress = async (topic_id, user_id) => {
  const formData = new FormData();
  formData.append("operation", "updateTopicProgress");
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

// TEST RELATED FUNCTIONS

export const getTestQuestions = async (test_id) => {
  try {
    const res = await axios(`${BASE_URL}student/process/tests.php`, {
      method: "GET",
      params: {
        operation: "getTestQuestions",
        json: JSON.stringify({
          test_id: test_id,
        }),
      },
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status error" };
    }

    if (!res.data.success) {
      return {
        success: false,
        data: [],
        message: res.data.message || "Failed to fetch test questions",
      };
    }

    return { success: true, data: res.data.data, message: "" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching test questions";
    return { success: false, data: [], message: errorMessage };
  }
};

export const submitTestResponses = async (test_id, user_id, responses) => {
  const formData = new FormData();
  formData.append("operation", "submitTestResponses");
  formData.append(
    "json",
    JSON.stringify({
      test_id: test_id,
      user_id: user_id,
      responses: responses,
    })
  );

  try {
    const res = await axios(`${BASE_URL}student/process/tests.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 201) {
      return { success: false, data: [], message: "Status error" };
    }

    if (!res.data.success) {
      return {
        success: false,
        data: [],
        message: res.data.message || "Failed to submit test responses",
      };
    }

    return { success: true, data: res.data.data, message: res.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while submitting test responses";
    return { success: false, data: [], message: errorMessage };
  }
};

export const getCourseTests = async (course_id, user_id) => {
  try {
    const res = await axios(`${BASE_URL}student/process/tests.php`, {
      method: "GET",
      params: {
        operation: "getCourseTests",
        json: JSON.stringify({
          course_id: course_id,
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

    if (!res.data.success) {
      return {
        success: false,
        data: [],
        message: res.data.message || "Failed to fetch course tests",
      };
    }

    return { success: true, data: res.data.data, message: "" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching course tests";
    return { success: false, data: [], message: errorMessage };
  }
};

export const getUserTestResults = async (user_id, test_id) => {
  try {
    const res = await axios(`${BASE_URL}student/process/tests.php`, {
      method: "GET",
      params: {
        operation: "getUserTestResults",
        json: JSON.stringify({
          user_id: user_id,
          test_id: test_id,
        }),
      },
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status error" };
    }

    if (!res.data.success) {
      return {
        success: false,
        data: [],
        message: res.data.message || "Failed to fetch test results",
      };
    }

    return { success: true, data: res.data.data, message: "" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching test results";
    return { success: false, data: [], message: errorMessage };
  }
};

export const checkPreTestCompletion = async (user_id, course_id) => {
  try {
    const res = await axios(`${BASE_URL}student/process/tests.php`, {
      method: "GET",
      params: {
        operation: "checkPreTestCompletion",
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
      return { success: false, data: null, message: "Status error" };
    }

    return { success: true, data: res.data.data, message: res.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while checking pre-test completion";
    return { success: false, data: null, message: errorMessage };
  }
};

// EVALUATION RELATED FUNCTIONS

export const submitCourseEvaluation = async (course_id, user_id, evaluation_type, answers) => {
  try {
    const res = await axios(`${BASE_URL}student/process/evaluation.php`, {
      method: "POST",
      data: {
        course_id: course_id,
        evaluation_type: evaluation_type,
        answers: answers,
      },
      headers: {
        Authorization: SECRET_KEY,
        "Content-Type": "application/json",
      },
    });

    if (res.status !== 200) {
      return { success: false, data: null, message: "Status error" };
    }

    return { success: true, data: res.data.data, message: res.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while submitting evaluation";
    return { success: false, data: null, message: errorMessage };
  }
};

export const getEvaluationStatus = async (course_id, user_id) => {
  try {
    const res = await axios(`${BASE_URL}student/process/evaluation.php`, {
      method: "GET",
      params: {
        course_id: course_id,
      },
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status error" };
    }

    return { success: true, data: res.data.data, message: res.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching evaluation status";
    return { success: false, data: [], message: errorMessage };
  }
};
