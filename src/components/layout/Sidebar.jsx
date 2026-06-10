import React from "react";
import {
  LayoutDashboard,
  Calendar,
  UtensilsCrossed,
  GraduationCap,
  UserCheck,
  Users,
  Users2,
  BarChart3,
  Settings,
  ChevronLeft,
  X,
  List,
  Tag,
  Package,
  CreditCard,
} from "lucide-react";

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
      { path: "/customer-types", label: "Client Type", icon: Users },
      { path: "/customer-metafields", label: "Client Metafields", icon: List },
    ],
  },
  {
    section: "Inventory",
    items: [
      { path: "/categories", label: "Categories", icon: Tag },
      { path: "/units", label: "Units", icon: Package },
    ],
  },
  {
    section: "Staff",
    items: [{ path: "/staff", label: "Staff & Payroll", icon: Users2 }],
  },
  {
    section: "Enterprise",
    items: [
      { path: "/payment-types", label: "Payment Types", icon: CreditCard },
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
  mobileOpen,
  onMobileClose,
}) {
  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${
        mobileOpen ? "sidebar--mobile-open" : ""
      }`}
    >
      <div className="sidebar-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="logo-mark">C</div>
        </div>
        <button
          type="button"
          className="sidebar-close-desktop"
          onClick={() => setCollapsed(true)}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          className="sidebar-close-mobile"
          onClick={onMobileClose}
          aria-label="Close navigation menu"
        >
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-nav">
        {NAV.map((group) => (
          <div key={group.section}>
            <div className="sidebar-section-label">{group.section}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.path}
                  className={`sidebar-item ${
                    activePage === item.path ? "active" : ""
                  }`}
                  onClick={() => setActivePage(item.path)}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">A</div>
        <div>
          <div className="sidebar-user-name">Ankit Panta</div>
          <div className="sidebar-user-role">Admin</div>
        </div>
      </div>
    </aside>
  );
}
