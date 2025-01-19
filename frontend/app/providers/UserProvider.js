import { useLoadingStore } from "@/store/loadingStore";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const loading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setIsLoading);

  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = sessionStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [setLoading]);

  const updateUser = (newUserData) => {
    try {
      if (newUserData) {
        sessionStorage.setItem("user", JSON.stringify(newUserData));
        setUser(newUserData);
      } else {
        sessionStorage.removeItem("user");
        setUser(null);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    updateUser,
    logout,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
