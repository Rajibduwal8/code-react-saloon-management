import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EnrollStudentModal from "../components/modals/EnrollStudentModal";
import { getStudentById } from "../services/studentService";

export default function StudentEdit() {
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
            gap: 12,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <button
            className="btn-outline"
            onClick={() => navigate(`/students/${id}`)}
          >
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <div className="page-title">Edit Student</div>
            <div className="page-subtitle">
              Update student enrollment details
            </div>
          </div>
        </div>
      </div>

      {student && (
        <EnrollStudentModal
          studentData={student}
          onClose={() => navigate(`/students/${id}`)}
          onSuccess={() => navigate(`/students/${id}`)}
        />
      )}
    </div>
  );
}
