"use server";
import axios from "axios";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export const getSession = async () => {
  try {
    const cookieGet = await cookies();

    const session_id = cookieGet.get("session_id")?.value;
    const session_token = cookieGet.get("session_token")?.value;

    if (!session_id || !session_token) {
      return null;
    }

    const res = await axios(`${BASE_URL}speaker/auth/auth.php`, {
      method: "GET",
      params: {
        operation: "getSession",
        json: JSON.stringify([]),
      },
      headers: {
        Authorization: "28235638-ece9-4c21-a8cc-d4175ec23558",
        SESSION_ID: session_id,
        SESSION_TOKEN: session_token,
      },
    });

    if (res.status !== 200) {
      return false;
    }

    return {
      isAuthenticated: true,
      userType_id: res.data.data.userType_id,
    };
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};