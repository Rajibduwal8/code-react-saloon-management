"use client";

import { useState, useEffect } from "react";

const useProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserProfile(user);
        setToken(user?.accessToken || user?.token || null);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { userProfile, loading, token };
};

export default useProfile;
