/**
 * Routing Configuration
 * Central place to manage all application routes
 */

import Dashboard from "../pages/Dashboard";
import Appointments from "../pages/Appointments";
import ServiceMenu from "../pages/ServiceMenu";
import Courses from "../pages/Courses";
import Client from "../pages/Client";
import Students from "../pages/Students";
import Staff from "../pages/Staff";
import Analytics from "../pages/Analytics";
import StudentDetail from "../pages/StudentDetail";
import StudentEdit from "../pages/StudentEdit";
import ClientDetail from "../pages/ClientDetail";
import ClientEdit from "../pages/ClientEdit";
import StaffDetail from "../pages/StaffDetail";
import StaffEdit from "../pages/StaffEdit";
import AppointmentDetail from "../pages/AppointmentDetail";
import AppointmentEdit from "../pages/AppointmentEdit";
import CourseDetail from "../pages/CourseDetail";
import CourseEdit from "../pages/CourseEdit";

/**
 * Route configuration object
 * Maps route paths to their components
 */
export const routes = [
  {
    path: "/",
    label: "Dashboard",
    component: Dashboard,
    icon: "LayoutDashboard",
  },
  {
    path: "/appointments",
    label: "Appointments",
    component: Appointments,
    icon: "Calendar",
  },
  {
    path: "/service-menu",
    label: "Service Menu",
    component: ServiceMenu,
    icon: "Scissors",
  },
  {
    path: "/courses",
    label: "Courses",
    component: Courses,
    icon: "BookOpen",
  },
  {
    path: "/clients",
    label: "Clients",
    component: Client,
    icon: "Users",
  },
  {
    path: "/clients/:id",
    component: ClientDetail,
    private: true,
  },
  {
    path: "/clients/:id/edit",
    component: ClientEdit,
    private: true,
  },
  {
    path: "/students",
    label: "Students",
    component: Students,
    icon: "GraduationCap",
  },
  {
    path: "/students/:id",
    component: StudentDetail,
    private: true,
  },
  {
    path: "/students/:id/edit",
    component: StudentEdit,
    private: true,
  },
  {
    path: "/staff",
    label: "Staff",
    component: Staff,
    icon: "Users2",
  },
  {
    path: "/staff/:id",
    component: StaffDetail,
    private: true,
  },
  {
    path: "/staff/:id/edit",
    component: StaffEdit,
    private: true,
  },
  {
    path: "/appointments/:id",
    component: AppointmentDetail,
    private: true,
  },
  {
    path: "/appointments/:id/edit",
    component: AppointmentEdit,
    private: true,
  },
  {
    path: "/courses/:id",
    component: CourseDetail,
    private: true,
  },
  {
    path: "/courses/:id/edit",
    component: CourseEdit,
    private: true,
  },
  {
    path: "/analytics",
    label: "Analytics",
    component: Analytics,
    icon: "BarChart3",
  },
  {
    path: "/settings",
    label: "Settings",
    component: () => (
      <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⚙️</div>
        <div
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: 20,
            color: "var(--dark)",
          }}
        >
          Tenant Settings
        </div>
        <div style={{ fontSize: 13, marginTop: 6 }}>
          System configuration and preferences
        </div>
      </div>
    ),
    icon: "Settings",
  },
];

/**
 * Get sidebar routes (only those with labels)
 */
export const getSidebarRoutes = () => {
  return routes.filter((route) => route.label);
};

/**
 * Get route by path
 */
export const getRouteByPath = (path) => {
  return routes.find((route) => route.path === path);
};
