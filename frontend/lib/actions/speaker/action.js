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
      "An error occurred while generating course id";
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
        message: "Something went wrong while fetching categories",
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

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status Error" };
    }

    if (res.data.success === false) {
      return {
        success: false,
        data: [],
        message: res.data.message || "Something went wrong updating the course",
      };
    }

    return {
      success: true,
      data: res.data,
      message: res.data.message || "Course updated successfully",
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

export const createLesson = async (
  lesson_id,
  course_id,
  title,
  description,
  resources,
  sequence_number
) => {
  const formData = new FormData();
  formData.append("operation", "createLesson");
  formData.append(
    "json",
    JSON.stringify({
      lesson_id: lesson_id,
      course_id: course_id,
      title: title,
      description: description,
      resources: resources,
      sequence_number: sequence_number,
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
      return { success: false, data: res.data, message: "Status error" };
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

export const updateLesson = async (
  lesson_id,
  course_id,
  title,
  description,
  resources,
  sequence_number
) => {
  try {
    const formData = new FormData();
    formData.append("operation", "updateLesson");

    const jsonData = {
      lesson_id: lesson_id,
      course_id: course_id,
      title: title,
      description: description,
      resources: resources,
      sequence_number: sequence_number,
    };

    formData.append("json", JSON.stringify(jsonData));

    const res = await axios(`${BASE_URL}speaker/process/lessons.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    return {
      success: true,
      data: res.data,
      message: "Lesson updated successfully",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred updating the lesson";
    return {
      success: false,
      data: [],
      message: errorMessage,
    };
  }
};

export const deleteLesson = async (lesson_id) => {
  try {
    const res = await axios.delete(`${BASE_URL}speaker/process/lessons.php`, {
      headers: {
        Authorization: SECRET_KEY,
      },
      data: {
        operation: "deleteLesson",
        json: JSON.stringify({
          lesson_id: lesson_id,
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
        message: "Something went wrong deleting lesson",
      };
    }

    return { success: true, data: [], message: res.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while removing the lesson";
    return { success: false, data: [], message: errorMessage };
  }
};

export const updateLessonSequence = async (lessonUpdates) => {
  const formData = new FormData();
  formData.append("operation", "updateLessonSequence");
  formData.append("json", JSON.stringify(lessonUpdates));

  try {
    const res = await axios(`${BASE_URL}speaker/process/lessons.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status Error" };
    }

    if (res.data.success === false) {
      return {
        success: false,
        data: [],
        message:
          res.data.message || "Something went wrong updating lesson sequence",
      };
    }

    return { success: true, data: res.data.data, message: res.data.message };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    return { success: false, data: [], message: errorMessage };
  }
};

// GET TOPIC DATAS

export const generateTopicID = async () => {
  try {
    const res = await axios(`${BASE_URL}speaker/process/topics.php`, {
      method: "GET",
      params: {
        operation: "generateTopicID",
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
        message: "Something went wrong generating topic id",
      };
    }

    return { success: true, data: res.data.message, message: "" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while generating topic id";
    return { success: false, data: [], message: errorMessage };
  }
};

export const getTopicDetails = async (topic_id) => {
  try {
    const res = await axios(`${BASE_URL}speaker/process/topics.php`, {
      method: "GET",
      params: {
        operation: "getTopicDetails",
        json: JSON.stringify({
          topic_id: topic_id,
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
      "An error occurred while fetching topic details";
    return { success: false, data: [], message: errorMessage };
  }
};

// TOPIC CUD OPERATIONS

export const createTopic = async (
  topic_id,
  lesson_id,
  topic_title,
  topic_description,
  sequence_number,
  fileName
) => {
  try {
    const jsonData = {
      topic_id,
      lesson_id,
      topic_title,
      topic_description,
      sequence_number,
      file_name: fileName,
    };

    const formData = new FormData();
    formData.append("operation", "createTopic");
    formData.append("json", JSON.stringify(jsonData));

    const res = await axios(`${BASE_URL}speaker/process/topics.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status !== 201 || res.statusText !== "Created") {
      return { success: false, data: [], message: "Status Error" };
    }

    return {
      success: true,
      data: res.data.message,
      message: "Topic created successfully",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while creating the topic";
    return { success: false, data: [], message: errorMessage };
  }
};

export const updateTopic = async (
  topic_id,
  topic_title,
  topic_description,
  fileName
) => {
  try {
    const formData = new FormData();
    formData.append("operation", "updateTopic");

    const jsonData = {
      topic_id: topic_id,
      topic_title: topic_title,
      topic_description: topic_description,
      fileName: fileName,
    };

    formData.append("json", JSON.stringify(jsonData));

    const res = await axios(`${BASE_URL}speaker/process/topics.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    return {
      success: true,
      data: res.data,
      message: "Lesson updated successfully",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred updating the lesson";
    return {
      success: false,
      data: [],
      message: errorMessage,
    };
  }
};

export const updateTopicSequence = async (topicUpdates) => {
  const formData = new FormData();
  formData.append("operation", "updateTopicSequence");
  formData.append("json", JSON.stringify(topicUpdates));

  try {
    const res = await axios(`${BASE_URL}speaker/process/topics.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status Error" };
    }

    if (res.data.success === false) {
      return {
        success: false,
        data: [],
        message:
          res.data.message || "Something went wrong updating topic sequence",
      };
    }

    return { success: true, data: res.data.data, message: res.data.message };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    return { success: false, data: [], message: errorMessage };
  }
};

export const deleteTopicAct = async (topic_id) => {
  try {
    const res = await axios.delete(`${BASE_URL}speaker/process/topics.php`, {
      headers: {
        Authorization: SECRET_KEY,
      },
      data: {
        operation: "deleteTopic",
        json: JSON.stringify({
          topic_id: topic_id,
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
        message: "Something went wrong deleting topic",
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

// GET STUDENT DATAS

export const getCourseStudents = async (course_id) => {
  try {
    const res = await axios(`${BASE_URL}speaker/process/students.php`, {
      method: "GET",
      params: {
        operation: "getCourseStudents",
        json: JSON.stringify({
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

    return { success: true, data: res.data.data.students, message: "" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching students";
    return { success: false, data: [], message: errorMessage };
  }
};

// GET TEST DETAILS

export const getTestDetails = async (test_id) => {
  try {
    const res = await axios(`${BASE_URL}speaker/process/tests.php`, {
      method: "GET",
      params: {
        operation: "getTest",
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

    return { success: true, data: res.data.data, message: "" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching tests";
    return { success: false, data: [], message: errorMessage };
  }
};

// TEST MANAGEMENT FUNCTIONS

export const createTest = async (testData) => {
  const formData = new FormData();

  formData.append("operation", "createTest");
  formData.append("json", JSON.stringify(testData));

  console.log("WHAT THE FUCK IS IT?: ", testData);

  try {
    const res = await axios(`${BASE_URL}speaker/process/tests.php`, {
      method: "POST",
      headers: {
        Authorization: SECRET_KEY,
      },
      data: formData,
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status error" };
    }

    if (!res.data.success) {
      return {
        success: false,
        data: [],
        message: res.data.message || "Failed to create test",
      };
    }

    return { success: true, data: res.data.data, message: res.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while creating the test";
    return { success: false, data: [], message: errorMessage };
  }
};

export const updateTest = async (testData) => {
  const formData = new FormData();

  formData.append("operation", "updateTest");
  formData.append(
    "json",
    JSON.stringify({
      test_id: testData.test_id.test_id,
      test_title: testData.test_title,
      test_type: testData.test_type,
      questions: testData.questions,
    })
  );
  try {
    const res = await axios(`${BASE_URL}speaker/process/tests.php`, {
      method: "POST",
      headers: {
        Authorization: SECRET_KEY,
      },
      data: formData,
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status error" };
    }

    if (!res.data.success) {
      return {
        success: false,
        data: [],
        message: res.data.message || "Failed to update test",
      };
    }

    return { success: true, data: res.data.data, message: res.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while updating the test";
    return { success: false, data: [], message: errorMessage };
  }
};

export const deleteTest = async (test_id) => {
  const formData = new FormData();

  formData.append("operation", "deleteTest");
  formData.append(
    "json",
    JSON.stringify({
      test_id: test_id,
    })
  );
  try {
    const res = await axios(`${BASE_URL}speaker/process/tests.php`, {
      method: "POST",
      data: formData,
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
        message: res.data.message || "Failed to delete test",
      };
    }

    return { success: true, data: res.data.data, message: res.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while deleting the test";
    return { success: false, data: [], message: errorMessage };
  }
};

export const getCourseTests = async (course_id) => {
  try {
    const res = await axios(`${BASE_URL}speaker/process/tests.php`, {
      method: "GET",
      params: {
        operation: "getCourseTests",
        json: JSON.stringify({
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

export const getLessonTests = async (lesson_id) => {
  try {
    const res = await axios(`${BASE_URL}speaker/process/tests.php`, {
      method: "GET",
      params: {
        operation: "getLessonTests",
        json: JSON.stringify({
          lesson_id: lesson_id,
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
        message: res.data.message || "Failed to fetch lesson tests",
      };
    }

    return { success: true, data: res.data.data, message: "" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching lesson tests";
    return { success: false, data: [], message: errorMessage };
  }
};

// ENROLLMENT APPROVALS
export const getPendingEnrollments = async (speaker_id) => {
  try {
    const res = await axios(`${BASE_URL}speaker/process/students.php`, {
      method: "GET",
      params: {
        operation: "getPendingEnrollments",
        json: JSON.stringify({ speaker_id }),
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
      "An error occurred while fetching pending enrollments";
    return { success: false, data: [], message: errorMessage };
  }
};

export const approveEnrollment = async (enrollment_id) => {
  const formData = new FormData();
  formData.append("operation", "approveEnrollment");
  formData.append("json", JSON.stringify({ enrollment_id }));
  try {
    const res = await axios(`${BASE_URL}speaker/process/students.php`, {
      method: "POST",
      data: formData,
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
      "An error occurred while approving enrollment";
    return { success: false, data: [], message: errorMessage };
  }
};

export const denyEnrollment = async (enrollment_id) => {
  const formData = new FormData();
  formData.append("operation", "denyEnrollment");
  formData.append("json", JSON.stringify({ enrollment_id }));
  try {
    const res = await axios(`${BASE_URL}speaker/process/students.php`, {
      method: "POST",
      data: formData,
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
      "An error occurred while denying enrollment";
    return { success: false, data: [], message: errorMessage };
  }
};
