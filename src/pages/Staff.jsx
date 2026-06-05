"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Navigation handled by Next.js wrapper
// import { useNavigate } from "react-router-dom";
import { EditIcon, Eye, Plus, Trash2Icon } from "lucide-react";
import Pagination from "../components/ui/Pagination";
import StaffModal from "../components/modals/StaffModal";
import { getStaff, deleteStaff } from "../services/staffService";

export default function Staff() {
  const router = useRouter();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getStaff();
        setStaffList(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaff(id);
        setStaffList(staffList.filter((s) => s.id !== id));
      } catch (error) {
        console.error("Error deleting staff:", error);
      }
    }
  };

  const handleAddSuccess = async () => {
    try {
      const data = await getStaff();
      setStaffList(data);
    } catch (error) {
      console.error("Error refreshing staff:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div className="page-title">Staff & Payroll</div>
            <div className="page-subtitle">
              Manage staff information, roles, departments, and payroll details.
            </div>
          </div>
          <button className="btn-outline" onClick={() => setShowModal(true)}>
            <Plus size={13} /> Add Staff
          </button>
        </div>
      </div>

      <div style={{ padding: "16px 28px 0" }}>
        <div
          style={{
            background: "white",
            border: "1px solid var(--sand)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 16px",
              borderBottom: "1px solid #F2EDE8",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--dark)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Staff Members
            </div>
            <div className="search-bar" style={{ minWidth: 220 }}>
              <input placeholder="Search Staff with Name / Email" />
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  {[
                    "Name",
                    "Position",
                    "Department",
                    "Email",
                    "Phone",
                    "Status",
                    "Salary",
                    "Action",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffList.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 12,
                          color: "var(--dark)",
                        }}
                      >
                        {member.firstName} {member.lastName}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>
                        ID: {member.id}
                      </div>
                    </td>
                    <td style={{ fontWeight: 500, fontSize: 12 }}>
                      {member.position}
                    </td>
                    <td style={{ fontSize: 12 }}>{member.department}</td>
                    <td style={{ fontSize: 11, color: "var(--muted)" }}>
                      {member.email}
                    </td>
                    <td style={{ fontSize: 12 }}>{member.phone}</td>
                    <td>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#4CAF50",
                        }}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: 12 }}>
                      NRS {member.salary}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => router.push(`/staff/${member.id}`)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#4CAF50",
                            fontSize: 14,
                          }}
                          title="View"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/staff/${member.id}/edit`)
                          }
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--warm)",
                            fontSize: 14,
                          }}
                          title="Edit"
                        >
                          <EditIcon size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#E05C5C",
                            fontSize: 14,
                          }}
                          title="Delete"
                        >
                          <Trash2Icon size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination />
        </div>
      </div>

      {showModal && (
        <StaffModal
          onClose={() => setShowModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
}
