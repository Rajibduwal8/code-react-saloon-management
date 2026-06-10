import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2Icon, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import AppointmentService from "../services/OrderingServices/AppointmentService";
import {
  formatAppointmentDateTime,
  formatPaymentStatus,
  getStatusColor,
  getPaymentColor,
} from "../utils/appointmentUtils";

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const data = await AppointmentService.getById(id);
      setAppointment(data);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      toast.error("Failed to load appointment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await AppointmentService.delete(id);
      toast.success("Appointment deleted");
      navigate("/appointments");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment");
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
          onClick={() => navigate("/appointments")}
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

  const { date, time, full } = formatAppointmentDateTime(
    appointment.appointmentDateTime,
  );
  const canComplete =
    String(appointment.status).toLowerCase() === "booked";
  const itemTotal = (appointment.details || []).reduce(
    (sum, d) =>
      sum + (Number(d.quantity) || 0) * (Number(d.unitPrice) || 0),
    0,
  );

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
              onClick={() => navigate("/appointments")}
            >
              <ArrowLeft size={13} /> Back
            </button>
            <div>
              <div className="page-title">Appointment #{appointment.id}</div>
              <div className="page-subtitle">
                {appointment.customerName} • {full}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {canComplete && (
              <button
                className="btn-primary"
                onClick={() => navigate(`/appointments/${id}/complete`)}
              >
                <CheckCircle size={14} /> Complete
              </button>
            )}
            <button
              className="btn-outline"
              onClick={() => navigate(`/appointments/${id}/edit`)}
            >
              <Edit size={14} /> Edit
            </button>
            <button className="btn-cancel" onClick={handleDelete}>
              <Trash2Icon size={14} /> Delete
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 28px", display: "grid", gap: 20 }}>
        <div className="stat-card" style={{ padding: 24 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}
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
                Customer
              </h3>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--dark)" }}>
                {appointment.customerName || "—"}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                ID: {appointment.customerId || "—"}
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
              <div style={{ fontSize: 14, fontWeight: 600 }}>{date}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                {time}
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
                Status
              </h3>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: getStatusColor(appointment.status),
                }}
              >
                {appointment.status || "—"}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: getPaymentColor(appointment.paymentStatus),
                  marginTop: 6,
                }}
              >
                Payment: {formatPaymentStatus(appointment.paymentStatus)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--muted)",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Remarks
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
              {appointment.remarks || "No remarks provided."}
            </div>
          </div>
        </div>

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
              padding: "14px 20px",
              borderBottom: "1px solid var(--sand)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--dark)",
                margin: 0,
              }}
            >
              Appointment Items
            </h3>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#4CAF50" }}>
              Rs. {itemTotal.toLocaleString()}
            </span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                {["Product / Service", "Type", "Qty", "Rate", "Total", "Remarks"].map(
                  (h) => (
                    <th key={h}>{h}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {(appointment.details || []).length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--muted)" }}>
                    No items
                  </td>
                </tr>
              ) : (
                appointment.details.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 500 }}>{d.productName || "—"}</td>
                    <td>{d.isService ? "Service" : "Product"}</td>
                    <td style={{ textAlign: "center" }}>{d.quantity}</td>
                    <td style={{ textAlign: "right" }}>
                      Rs. {(d.unitPrice || 0).toLocaleString()}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>
                      Rs.{" "}
                      {(
                        (Number(d.quantity) || 0) * (Number(d.unitPrice) || 0)
                      ).toLocaleString()}
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>
                      {d.remarks || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {(appointment.logs || []).length > 0 && (
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
                padding: "14px 20px",
                borderBottom: "1px solid var(--sand)",
              }}
            >
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--dark)",
                  margin: 0,
                }}
              >
                Activity Log
              </h3>
            </div>
            <div style={{ padding: "12px 20px" }}>
              {appointment.logs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #F2EDE8",
                    fontSize: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: getStatusColor(log.status) }}>
                      {log.status}
                    </span>
                    <span style={{ color: "var(--muted)" }}>
                      {new Date(log.createdDate).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ marginTop: 4, color: "var(--muted)" }}>
                    {log.remarks || "—"} • {log.createdBy}
                  </div>
                  <div style={{ marginTop: 2, color: getPaymentColor(log.paymentStatus) }}>
                    Payment: {formatPaymentStatus(log.paymentStatus)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
