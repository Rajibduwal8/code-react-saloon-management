"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AuthProtected = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // This runs only on the client, after hydration — safe to access localStorage
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.accessToken || user?.token || null;

      if (token) {
        setIsAuthorized(true);
      } else {
        toast.error("You are not authorized to access this page!");
        router.replace("/login");
      }
    } catch {
      router.replace("/login");
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  // While checking: return null (blank screen) — no flash, no spinner confusion
  if (isChecking) return null;

  // No token: redirect is in progress, show nothing
  if (!isAuthorized) return null;

  // Authorized: render the protected layout
  return <>{children}</>;
};

export default AuthProtected;
