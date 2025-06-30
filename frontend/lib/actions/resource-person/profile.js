"use server";
import axios from "axios";

const SECRET_KEY = process.env.SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export const updateProfileDetails = async (
  user_id,
  first_name,
  middle_name,
  last_name,
  suffix,
  age,
  date_of_birth,
  sex,
  gender,
  email,
  phone,
  address,
  barangay,
  municipality,
  province,
  region,
  employment_type,
  civil_service_eligibility,
  salary_grade,
  present_position,
  office,
  service,
  division_province,
  emergency_contact_name,
  emergency_contact_relationship,
  emergency_contact_address,
  emergency_contact_number,
  emergency_contact_email,
  blood_type,
  civil_status,
  type_of_disability,
  religion,
  educational_attainment,
  allergies,
  ip,
  office_id,
  position,
  bio,
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
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        suffix: suffix,
        age: age,
        date_of_birth: date_of_birth,
        sex: sex,
        gender: gender,
        email: email,
        phone: phone,
        address: address,
        barangay: barangay,
        municipality: municipality,
        province: province,
        region: region,
        employment_type: employment_type,
        civil_service_eligibility: civil_service_eligibility,
        salary_grade: salary_grade,
        present_position: present_position,
        office: office,
        service: service,
        division_province: division_province,
        emergency_contact_name: emergency_contact_name,
        emergency_contact_relationship: emergency_contact_relationship,
        emergency_contact_address: emergency_contact_address,
        emergency_contact_number: emergency_contact_number,
        emergency_contact_email: emergency_contact_email,
        blood_type: blood_type,
        civil_status: civil_status,
        type_of_disability: type_of_disability,
        religion: religion,
        educational_attainment: educational_attainment,
        allergies: allergies,
        ip: ip,
        office_id: office_id,
        position: position,
        bio: bio,
        isPregnant: isPregnant,
        isPwd: isPwd,
        isSoloParent: isSoloParent,
      })
    );

    const res = await axios(`${BASE_URL}resource-person/process/profile.php`, {
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
      "An error occurred while updating profile";
    return { success: false, data: [], message: errorMessage };
  }
};

export const updatePassword = async (
  user_id,
  current_password,
  new_password
) => {
  try {
    const formData = new FormData();

    formData.append("operation", "updatePassword");
    formData.append(
      "json",
      JSON.stringify({
        user_id: user_id,
        current_password: current_password,
        new_password: new_password,
      })
    );

    const res = await axios(`${BASE_URL}resource-person/process/profile.php`, {
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
      "An error occurred while updating password";
    return { success: false, data: [], message: errorMessage };
  }
};

export const updateProfileImage = async (user_id, profile_image) => {
  try {
    const formData = new FormData();

    formData.append("profile_image", profile_image);

    formData.append("operation", "updateProfileImage");
    formData.append(
      "json",
      JSON.stringify({
        user_id: user_id,
      })
    );

    const res = await axios(`${BASE_URL}resource-person/process/profile.php`, {
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
