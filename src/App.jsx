import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import NewBookingModal from "./components/modals/NewBookingModal";
import EnrollStudentModal from "./components/modals/EnrollStudentModal";
import { getSidebarRoutes, getRouteByPath } from "./routes/index.jsx";

/**
 * Layout wrapper component that handles routing
 */
function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showEnroll, setShowEnroll] = useState(false);

  const sidebarRoutes = getSidebarRoutes();
  const currentRoute = sidebarRoutes.find(
    (route) => route.path === location.pathname,
  );
  const activePage = currentRoute?.path || "/";

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="layout">
      {mobileSidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop visible"
          aria-label="Close navigation menu"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <Sidebar
        activePage={activePage}
        setActivePage={handleNavigation}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        routes={sidebarRoutes}
      />

      <div className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        <Topbar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onQuickBooking={() => setShowBooking(true)}
          onEnrollStudent={() => setShowEnroll(true)}
        />

        {/* Page routes */}
        <Routes>
          {/* Import routes from routes configuration */}
          {getSidebarRoutes().map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          {/* Detail and edit routes */}
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/clients/:id/edit" element={<ClientEdit />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/students/:id/edit" element={<StudentEdit />} />
          <Route path="/staff/:id" element={<StaffDetail />} />
          <Route path="/staff/:id/edit" element={<StaffEdit />} />
          <Route path="/appointments/:id/complete" element={<AppointmentComplete />} />
          <Route path="/appointments/:id/edit" element={<AppointmentEdit />} />
          <Route path="/appointments/:id" element={<AppointmentDetail />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/courses/:id/edit" element={<CourseEdit />} />
        </Routes>
      </div>

      {showBooking && (
        <NewBookingModal
          onClose={() => setShowBooking(false)}
          onSuccess={() => setShowBooking(false)}
        />
      )}
      {showEnroll && (
        <EnrollStudentModal onClose={() => setShowEnroll(false)} />
      )}
    </div>
  );
}

// Import detail and edit pages
import ClientDetail from "./pages/ClientDetail";
import ClientEdit from "./pages/ClientEdit";
import StudentDetail from "./pages/StudentDetail";
import StudentEdit from "./pages/StudentEdit";
import StaffDetail from "./pages/StaffDetail";
import StaffEdit from "./pages/StaffEdit";
import AppointmentDetail from "./pages/AppointmentDetail";
import AppointmentEdit from "./pages/AppointmentEdit";
import AppointmentComplete from "./pages/AppointmentComplete";
import CourseDetail from "./pages/CourseDetail";
import CourseEdit from "./pages/CourseEdit";

// Import auth pages and toast
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";

/**
 * Protected Route Wrapper
 */
function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/**
 * Main App component with Router
 */
export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
