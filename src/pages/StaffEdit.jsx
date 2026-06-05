import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import StaffModal from "../components/modals/StaffModal";
import { getStaffById } from "../services/staffService";

export default function StaffEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
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
            onClick={() => navigate(`/staff/${id}`)}
          >
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <div className="page-title">Edit Staff</div>
            <div className="page-subtitle">Update staff information</div>
          </div>
        </div>
      </div>

      {staff && (
        <StaffModal
          staffData={staff}
          onClose={() => navigate(`/staff/${id}`)}
          onSuccess={() => navigate(`/staff/${id}`)}
        />
      )}
    </div>
  );
}
