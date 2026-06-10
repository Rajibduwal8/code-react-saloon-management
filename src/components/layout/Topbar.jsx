import React from "react";
import { Search, Menu, Plus, GraduationCap } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

export default function Topbar({
  collapsed,
  setCollapsed,
  onOpenMobileSidebar,
  onQuickBooking,
  onEnrollStudent,
}) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-menu-btn topbar-menu-btn--mobile"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>
        {collapsed && (
          <button
            type="button"
            className="topbar-menu-btn topbar-menu-btn--desktop"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
          >
            <Menu size={18} />
          </button>
        )}
        <div className="search-bar topbar-search">
          <Search size={14} color="var(--muted)" />
          <input placeholder="Search database across entities..." />
        </div>
      </div>

      <div className="topbar-actions">
        <button className="btn-primary" onClick={onQuickBooking}>
          <Plus size={13} />
          <span className="btn-text">Quick Booking</span>
        </button>
        <button className="btn-outline" onClick={onEnrollStudent}>
          <GraduationCap size={13} />
          <span className="btn-text">Enroll Student</span>
        </button>
        <ProfileDropdown />
      </div>
    </div>
  );
}
