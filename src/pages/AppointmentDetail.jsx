"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Navigation handled by Next.js wrapper
// import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2Icon } from "lucide-react";
import {
  getAppointmentById,
  deleteAppointment,
} from "../services/appointmentService";

export default function AppointmentDetail({ id }) {
  const router = useRouter();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = await getAppointmentById(id);
        setAppointment(data);
      } catch (error) {
        console.error("Error fetching appointment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Delete this appointment?")) {
      try {
        await deleteAppointment(id);
        router.push("/appointments");
      } catch (error) {
        console.error("Error deleting appointment:", error);
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

  if (!appointment) {
    return (
      <div style={{ padding: "40px 28px" }}>
        <button
          className="btn-outline"
          onClick={() => router.push("/appointments")}
          style={{ marginBottom: 20 }}
        >
          <ArrowLeft size={13} /> Back to Appointments
        </button>
        <div style={{ textAlign: "center", color: "var(--muted)" }}>
          Appointment not found
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
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="btn-outline"
              onClick={() => router.push("/appointments")}
            >
              <ArrowLeft size={13} /> Back
            </button>
            <div>
              <div className="page-title">Appointment Details</div>
              <div className="page-subtitle">
                {appointment.customerName} • {appointment.date}{" "}
                {appointment.time}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn-outline"
              onClick={() => router.push(`/appointments/${id}/edit`)}
            >
              <Edit size={14} /> Edit
            </button>
            <button className="btn-cancel" onClick={handleDelete}>
              <Trash2Icon size={14} /> Delete
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 28px" }}>
        <div className="stat-card" style={{ padding: 24 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}
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
                Appointment Information
              </h3>
              <div style={{ display: "grid", gap: 16 }}>
                {[
                  { label: "Customer", value: appointment.customerName },
                  { label: "Service", value: appointment.service },
                  { label: "Therapist", value: appointment.therapist },
                  { label: "Status", value: appointment.status },
                ].map((item) => (
                  <div key={item.label}>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--dark)",
                      }}
                    >
                      {item.value || "—"}
                    </div>
                  </div>
                ))}
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
                Schedule
              </h3>
              <div style={{ display: "grid", gap: 16 }}>
                {[
                  { label: "Date", value: appointment.date },
                  { label: "Time", value: appointment.time },
                  { label: "Customer ID", value: appointment.customerId },
                ].map((item) => (
                  <div key={item.label}>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--dark)",
                      }}
                    >
                      {item.value || "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <h3
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--muted)",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Notes
            </h3>
            <div
              style={{
                background: "#FAF6F0",
                padding: 18,
                borderRadius: 12,
                color: "var(--dark)",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              {appointment.notes || "No additional notes provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
