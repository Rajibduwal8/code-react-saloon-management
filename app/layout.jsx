"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/src/components/layout/Sidebar";
import Topbar from "@/src/components/layout/Topbar";
import NewBookingModal from "@/src/components/modals/NewBookingModal";
import EnrollStudentModal from "@/src/components/modals/EnrollStudentModal";
import { Toaster } from "react-hot-toast";
import AuthProtected from "@/src/components/common/AuthProtected";
import "@/src/styles/index.css";

// Sidebar routes configuration
const getSidebarRoutes = () => [
  { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { path: "/appointments", label: "Appointments", icon: "Calendar" },
  { path: "/clients", label: "Clients", icon: "Users" },
  { path: "/students", label: "Students", icon: "BookOpen" },
  { path: "/staff", label: "Staff", icon: "User" },
  { path: "/courses", label: "Courses", icon: "Layers" },
  { path: "/analytics", label: "Analytics", icon: "BarChart3" },
  { path: "/service-menu", label: "Service Menu", icon: "Grid" },
];

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/org-register",
  "/forgot-password",
  "/reset-password"
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showEnroll, setShowEnroll] = useState(false);

  // Get the current route to determine active page
  const sidebarRoutes = getSidebarRoutes();
  const currentRoute = sidebarRoutes.find((route) => route.path === pathname);
  const activePage = currentRoute?.path || "/";

  const handleNavigation = (path) => {
    // Next.js handles navigation through Link components or router.push()
    // The navigation happens through the Sidebar component
  };

  const isAuthPage = PUBLIC_PATHS.includes(pathname);

  if (isAuthPage) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Wellness Studio</title>
        </head>
        <body>
        <Toaster position="top-right" />
        {children}
      </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Wellness Studio</title>
        <script src="/config.js"></script>
      </head>
      <body>
        <Toaster position="top-right" />
        <AuthProtected>
          <div className="layout">
            <Sidebar
              activePage={activePage}
              setActivePage={handleNavigation}
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
              routes={sidebarRoutes}
            />

            <div className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
              <Topbar
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                onQuickBooking={() => setShowBooking(true)}
                onEnrollStudent={() => setShowEnroll(true)}
              />

              {/* Page content */}
              <div className="page-content">{children}</div>

              {showBooking && (
                <NewBookingModal onClose={() => setShowBooking(false)} />
              )}
              {showEnroll && (
                <EnrollStudentModal onClose={() => setShowEnroll(false)} />
              )}
            </div>
          </div>
        </AuthProtected>
      </body>
    </html>
  );
}
