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

export const uploadFileChunks = async (file) => {
  const chunkSize = 2048 * 2048;
  const totalChunks = Math.ceil(file.size / chunkSize);
  const fileId = crypto.randomUUID();

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const chunk = file.slice(
      chunkIndex * chunkSize,
      Math.min((chunkIndex + 1) * chunkSize, file.size)
    );

    const formData = new FormData();
    formData.append("chunk", new Blob([chunk]), "chunk");
    formData.append("chunkIndex", chunkIndex);
    formData.append("totalChunks", totalChunks);
    formData.append("fileId", fileId);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);

    try {
      const response = await axios(`${BASE_URL}upload_chunkz.php`, {
        method: "POST",
        data: formData,
        headers: {
          Authorization: SECRET_KEY,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success && response.data.data?.fileName) {
        return response.data.data.fileName;
      }
    } catch (error) {
      console.error("Chunk upload failed:", error);
      throw error;
    }
  }
};

export const createTopic = async (
  topic_id,
  lesson_id,
  topic_title,
  topic_description,
  sequence_number,
  file
) => {
  try {
    let fileName = null;

    if (file) {
      fileName = await uploadFileChunks(file);
    }

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
