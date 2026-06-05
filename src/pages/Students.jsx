import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditIcon, Eye, Plus, Trash2Icon } from "lucide-react";
import Pagination from "../components/ui/Pagination";
import EnrollStudentModal from "../components/modals/EnrollStudentModal";
import { getStudents, deleteStudent } from "../services/studentService";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        setStudents(students.filter((s) => s.id !== id));
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleAddSuccess = async () => {
    // Refresh students list
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Error refreshing students:", error);
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
            <div className="page-title">Student Enrollment Log</div>
            <div className="page-subtitle">
              Manage vocational courses, category classifications, and track
              student payment logs, communication logs, and issue certificates.
            </div>
          </div>
          <button className="btn-outline" onClick={() => setShowModal(true)}>
            <Plus size={13} /> New Enrollment
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
              Student Enrollments & Logs
            </div>
            <div className="search-bar" style={{ minWidth: 220 }}>
              <input placeholder="Search Student with Name / Id" />
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  {[
                    "Student Info",
                    "Course Details",
                    "Address",
                    "Mobile",
                    "Email",
                    "Timeline Info",
                    "National ID",
                    "Status",
                    "Balance",
                    "Action",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 12,
                          color: "var(--dark)",
                        }}
                      >
                        {student.name}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>
                        {student.studentId}
                      </div>
                    </td>
                    <td style={{ fontWeight: 500, fontSize: 12 }}>
                      {student.course}
                    </td>
                    <td style={{ fontSize: 12 }}>{student.address}</td>
                    <td style={{ fontSize: 12 }}>{student.mobile}</td>
                    <td style={{ fontSize: 11, color: "var(--muted)" }}>
                      {student.email}
                    </td>
                    <td>
                      <div style={{ fontSize: 11 }}>
                        START: {student.startDate}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>
                        DURATION: {student.duration} DAYS
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{student.nationalId}</td>
                    <td>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#4CAF50",
                        }}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "center", fontWeight: 600 }}>
                      {student.balance}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => navigate(`/students/${student.id}`)}
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
                            navigate(`/students/${student.id}/edit`)
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
                          onClick={() => handleDelete(student.id)}
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
        <EnrollStudentModal
          onClose={() => setShowModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
}
