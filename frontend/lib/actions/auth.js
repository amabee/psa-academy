"use server";
import axios from "axios";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export const login = async (user, password) => {
  const formData = new FormData();

  formData.append("operation", "login");
  formData.append(
    "json",
    JSON.stringify({
      user: user,
      password: password,
    })
  );

  try {
    const response = await axios({
      url: `${BASE_URL}auth/auth.php`,
      method: "POST",
      data: formData,
      withCredentials: true,
      headers: {
        Authorization: SECRET_KEY,
      },
      timeout: 3000,
    });

    if (response.status !== 200) {
      return { success: false, message: "Status Error", data: [] };
    }

    if (response.data.success == false) {
      return { success: false, message: response.data.message, data: [] };
    }

    const cookieStore = await cookies();

    await cookieStore.set("session_id", response.data.data.session_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7200,
    });

    await cookieStore.set("session_token", response.data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7200,
    });

    return { success: true, message: "", data: response.data };
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during login";

    return {
      success: false,
      message: errorMessage,
      data: [],
    };
  }
};

export const signup = async (
  firstname,
  middlename,
  lastname,
  email,
  username,
  phoneNumber,
  bday,
  gender,
  password
) => {
  const formData = new FormData();

  formData.append("operation", "signup");
  formData.append(
    "json",
    JSON.stringify({
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      email: email,
      username: username,
      phoneNumber: phoneNumber,
      bday: bday,
      gender: gender,
      password: password,
    })
  );
  try {
    const response = await axios({
      url: `${BASE_URL}auth/auth.php`,
      method: "POST",
      data: formData,
      withCredentials: true,
      headers: {
        Authorization: SECRET_KEY,
      },
    });

    if (response.data.success == false) {
      return { success: false, data: [], message: response.data.message };
    }

    return { success: true, data: [], message: response.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during login";
    return { success: false, data: [], message: errorMessage };
  }
};

export const logout = async () => {
  const cookieStore = await cookies();

  await cookieStore.set("session_id", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  await cookieStore.set("session_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  await cookieStore.set("clear-user-data", "true", {
    httpOnly: false,
    path: "/",
    maxAge: 10,
  });

  return { success: true, data: [], message: "Logged out successfully" };
};
