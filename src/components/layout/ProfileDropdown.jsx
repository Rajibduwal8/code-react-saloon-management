"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown } from "lucide-react";
import useProfile from "@/src/hooks/useProfile";
import { handleLogout } from "@/src/utils/authUtils";

export default function ProfileDropdown() {
  const router = useRouter();
  const { userProfile } = useProfile();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Resolve user name from various possible response shapes
  const userName =
    userProfile?.user?.name ||
    userProfile?.userName ||
    userProfile?.name ||
    "User";

  // Resolve logo from APP_CONFIG api3 + logoPath (same pattern as reference)
  const logoPath =
    userProfile?.organizationInfo?.logoPath ||
    userProfile?.user?.logoPath ||
    null;

  const logoUrl =
    typeof window !== "undefined" && window.APP_CONFIG
      ? window.APP_CONFIG.api3?.baseapi
      : "";

  const avatarSrc = logoPath
    ? `${logoUrl}/${logoPath}?t=${Date.now()}`
    : null;

  // Initials fallback avatar
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "none",
          border: "1px solid var(--border, #e5e7eb)",
          borderRadius: 24,
          padding: "5px 12px 5px 6px",
          cursor: "pointer",
          transition: "background 0.2s",
          color: "var(--text, #111)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--hover-bg, #f3f4f6)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "none")
        }
      >
        {/* Avatar */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #E8773A, #C9A882, #8B5E3C)",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarSrc}
              alt="avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                // If image fails to load, hide it and show initials
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            initials
          )}
        </div>

        {/* Name */}
        <span style={{ fontSize: 13, fontWeight: 500, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {userName}
        </span>

        <ChevronDown
          size={14}
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: "var(--muted, #6b7280)",
          }}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            minWidth: 200,
            background: "var(--card-bg, #fff)",
            border: "1px solid var(--border, #e5e7eb)",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 1000,
            overflow: "hidden",
            animation: "fadeInDown 0.15s ease",
          }}
        >
          {/* User info header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border, #e5e7eb)",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 13 }}>{userName}</div>
            <div style={{ fontSize: 11, color: "var(--muted, #6b7280)", marginTop: 2 }}>
              {userProfile?.user?.email || userProfile?.email || ""}
            </div>
          </div>

          {/* Profile link */}
          <button
            onClick={() => { setOpen(false); router.push("/profile"); }}
            style={dropdownItemStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg, #f9fafb)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <User size={14} />
            My Profile
          </button>

          {/* Logout */}
          <button
            onClick={() => { setOpen(false); handleLogout(); }}
            style={{ ...dropdownItemStyle, color: "#ef4444" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const dropdownItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  padding: "10px 16px",
  fontSize: 13,
  background: "transparent",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  transition: "background 0.15s",
  color: "inherit",
};
