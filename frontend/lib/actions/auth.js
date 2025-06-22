"use server";
import axios from "axios";
import { cookies } from "next/headers";
import https from 'https';

const SECRET_KEY = process.env.SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_ROOT_URL;

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  }),
  withCredentials: true,
});

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
    const response = await axiosInstance({
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

export const signup = async (formData) => {
  const formDataToSend = new FormData();

  formDataToSend.append("operation", "signup");
  formDataToSend.append(
    "json",
    JSON.stringify({
      // Personal Information
      firstname: formData.firstName,
      middlename: formData.middleName,
      lastname: formData.lastName,
      suffix: formData.suffix,
      dateOfBirth: formData.dateOfBirth,
      sex: formData.sex,
      bloodType: formData.bloodType,
      civilStatus: formData.civilStatus,
      typeOfDisability: formData.typeOfDisability,
      religion: formData.religion,
      educationalAttainment: formData.educationalAttainment,
      
      // Address
      houseNoAndStreet: formData.houseNoAndStreet,
      barangay: formData.barangay,
      municipality: formData.municipality,
      province: formData.province,
      region: formData.region,
      
      // Contact Information
      cellphoneNumber: formData.cellphoneNumber,
      emailAddress: formData.emailAddress,
      
      // Employment Details
      employmentType: formData.employmentType,
      civilServiceEligibility: formData.civilServiceEligibility,
      salaryGrade: formData.salaryGrade,
      presentPosition: formData.presentPosition,
      office: formData.office,
      service: formData.service,
      divisionProvince: formData.divisionProvince,
      
      // Emergency Contact
      emergencyContactName: formData.emergencyContactName,
      emergencyContactRelationship: formData.emergencyContactRelationship,
      emergencyContactAddress: formData.emergencyContactAddress,
      emergencyContactNumber: formData.emergencyContactNumber,
      emergencyContactEmail: formData.emergencyContactEmail,
      
      // Account Details
      username: formData.username,
      password: formData.password,
    })
  );
  
  try {
    const response = await axios({
      url: `${BASE_URL}auth/auth.php`,
      method: "POST",
      data: formDataToSend,
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
      "An error occurred during signup";
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
