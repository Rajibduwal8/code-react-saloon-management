import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2Icon } from "lucide-react";
import { getStudentById, deleteStudent } from "../services/studentService";

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudentById(id);
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        navigate("/students");
      } catch (error) {
        console.error("Error deleting student:", error);
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

  if (!student) {
    return (
      <div style={{ padding: "40px 28px" }}>
        <button
          className="btn-outline"
          onClick={() => navigate("/students")}
          style={{ marginBottom: 20 }}
        >
          <ArrowLeft size={13} /> Back to Students
        </button>
        <div style={{ textAlign: "center", color: "var(--muted)" }}>
          Student not found
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
          <button className="btn-outline" onClick={() => navigate("/students")}>
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <div className="page-title">{student.name}</div>
            <div className="page-subtitle">Student ID: {student.studentId}</div>
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
                    {student.name}
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
                    National ID
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {student.nationalId}
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
                    {student.mobile}
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
                    {student.email}
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
                Enrollment Information
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
                    Course
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {student.course}
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
                    Start Date
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {student.startDate}
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
                    Duration
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {student.duration} days
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
                    {student.status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="btn-outline"
              onClick={() => navigate(`/students/${id}/edit`)}
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
