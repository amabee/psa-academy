"use server";
import axios from "axios";

const SECRET_KEY = process.env.SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export const updateProfileDetails = async (
  user_id,
  email,
  bio,
  address,
  isPregnant,
  isPwd,
  isSoloParent
) => {
  try {
    const formData = new FormData();

    formData.append("operation", "updateProfileDetail");
    formData.append(
      "json",
      JSON.stringify({
        user_id: user_id,
        email: email,
        bio: bio,
        address: address,
        isPregnant: isPregnant,
        isPwd: isPwd,
        isSoloParent: isSoloParent,
      })
    );

    const res = await axios(`${BASE_URL}speaker/process/profile.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (res.status !== 200) {
      return { success: false, data: [], message: "Status error" };
    }

    return { success: true, data: [], message: res.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching courses";
    return { success: false, data: [], message: errorMessage };
  }
};

export const updateProfileImage = async (user_id, profile_image) => {
  try {
    const formData = new FormData();

    formData.append("profile_image", profile_image);

    formData.append("operation", "updateProfileIamge");
    formData.append(
      "json",
      JSON.stringify({
        user_id: user_id,
      })
    );

    const res = await axios(`${BASE_URL}speaker/process/profile.php`, {
      method: "POST",
      data: formData,
      headers: {
        Authorization: SECRET_KEY,
        "Content-Type": "multipart/form-data",
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
      "An error occurred while updating profile image";
    return { success: false, data: [], message: errorMessage };
  }
};
