"use client";

import React from "react";
import { Search, Menu, Plus, GraduationCap } from "lucide-react";
import ProfileDropdown from "@/src/components/layout/ProfileDropdown";

export default function Topbar({
  collapsed,
  setCollapsed,
  onQuickBooking,
  onEnrollStudent,
}) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted)",
              display: "flex",
            }}
          >
            <Menu size={18} />
          </button>
        )}
        <div className="search-bar">
          <Search size={14} color="var(--muted)" />
          <input placeholder="Search database across entities..." />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="btn-primary" onClick={onQuickBooking}>
          <Plus size={13} />
          Quick Booking
        </button>
        <button className="btn-outline" onClick={onEnrollStudent}>
          <GraduationCap size={13} />
          Enroll Student
        </button>
        <ProfileDropdown />
      </div>
    </div>
  );
}
