import { useAppStore } from "@/store/stateStore";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

useAppStore.getState().setIsLoading(true);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const loading = useAppStore((state) => state.isLoading);
  const setLoading = useAppStore((state) => state.setIsLoading);

  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem("user");
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
        localStorage.setItem("user", JSON.stringify(newUserData));
        setUser(newUserData);
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
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
