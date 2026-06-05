"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2Icon } from "lucide-react";
import { getStaffById, deleteStaff } from "../services/staffService";

export default function StaffDetail({ id }) {
  const router = useRouter();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getStaffById(id);
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaff(id);
        router.push("/staff");
      } catch (error) {
        console.error("Error deleting staff:", error);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div style={{ padding: "40px 28px" }}>
        <button
          className="btn-outline"
          onClick={() => router.push("/staff")}
          style={{ marginBottom: 20 }}
        >
          <ArrowLeft size={13} /> Back to Staff
        </button>
        <div style={{ textAlign: "center", color: "var(--muted)" }}>
          Staff member not found
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="page-header">
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <button className="btn-outline" onClick={() => router.push("/staff")}>
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <div className="page-title">
              {staff.firstName} {staff.lastName}
            </div>
            <div className="page-subtitle">{staff.position}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 28px" }}>
        <div
          style={{
            background: "white",
            border: "1px solid var(--sand)",
            borderRadius: 12,
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
              marginBottom: 32,
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Personal Information
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Full Name
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {staff.firstName} {staff.lastName}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Phone
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {staff.phone}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Email
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {staff.email}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Professional Information
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Position
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {staff.position}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Department
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {staff.department}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Join Date
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {staff.joinDate}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#4CAF50",
                      marginTop: 4,
                    }}
                  >
                    {staff.status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="btn-outline"
              onClick={() => navigate(`/staff/${id}/edit`)}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Edit size={13} /> Edit
            </button>
            <button
              className="btn-outline"
              onClick={handleDelete}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#E05C5C",
                borderColor: "#E05C5C",
              }}
            >
              <Trash2Icon size={13} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
