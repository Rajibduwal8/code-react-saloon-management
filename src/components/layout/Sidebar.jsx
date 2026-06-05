"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  UtensilsCrossed,
  GraduationCap,
  UserCheck,
  Users,
  Users2,
  CreditCard,
  BarChart3,
  Settings,
  ChevronLeft,
} from "lucide-react";

/**
 * Navigation structure for sidebar
 * Maps icon components to route paths
 */
const NAV = [
  {
    section: "Operations",
    items: [
      { path: "/", label: "Dashboard", icon: LayoutDashboard },
      { path: "/appointments", label: "Appointments", icon: Calendar },
      { path: "/service-menu", label: "Service Menu", icon: UtensilsCrossed },
    ],
  },
  {
    section: "Academy",
    items: [
      { path: "/courses", label: "Courses & Enrol", icon: GraduationCap },
      { path: "/clients", label: "Clients", icon: UserCheck },
      { path: "/students", label: "Students", icon: Users },
    ],
  },
  {
    section: "Staff",
    items: [{ path: "/staff", label: "Staff & Payroll", icon: Users2 }],
  },
  {
    section: "Enterprise",
    items: [
      { path: "/analytics", label: "Analytics", icon: BarChart3 },
      { path: "/settings", label: "Tenant Settings", icon: Settings },
    ],
  },
];

export default function Sidebar({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  routes,
}) {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo */}
      <div
        style={{
          padding: "18px 16px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="logo-mark">C</div>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--muted)",
            display: "flex",
          }}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: "16px" }}>
        {NAV.map((group) => (
          <div key={group.section}>
            <div className="sidebar-section-label">{group.section}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`sidebar-item ${activePage === item.path ? "active" : ""}`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--sand)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "var(--sand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "var(--muted)",
            fontWeight: 600,
          }}
        >
          A
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--dark)" }}>
            Ankit Panta
          </div>
          <div
            style={{
              fontSize: 10,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Admin
          </div>
        </div>
      </div>
    </div>
  );
}
