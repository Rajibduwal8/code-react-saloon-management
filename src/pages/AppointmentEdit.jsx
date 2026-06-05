import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getAppointmentById,
  updateAppointment,
} from "../services/appointmentService";

const STATUS_OPTIONS = ["CONFIRMED", "PENDING", "CANCELLED", "COMPLETED"];

export default function AppointmentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = await getAppointmentById(id);
        setAppointment(data);
        setForm({
          customerName: data?.customerName || "",
          customerId: data?.customerId || "",
          service: data?.service || "",
          therapist: data?.therapist || "",
          date: data?.date || "",
          time: data?.time || "",
          status: data?.status || "PENDING",
          notes: data?.notes || "",
        });
      } catch (error) {
        console.error("Error fetching appointment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  const setField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateAppointment(id, form);
      navigate(`/appointments/${id}`);
    } catch (error) {
      console.error("Error updating appointment:", error);
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
            gap: 12,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <button
            className="btn-outline"
            onClick={() => navigate(`/appointments/${id}`)}
          >
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <div className="page-title">Edit Appointment</div>
            <div className="page-subtitle">
              Update booking details for this appointment
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "16px 28px" }}>
        <div className="stat-card" style={{ padding: 24 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
          >
            <div>
              <label className="form-label">Customer Name</label>
              <input
                className="form-input"
                value={form.customerName}
                onChange={(e) => setField("customerName", e.target.value)}
                placeholder="Customer Name"
              />
            </div>
            <div>
              <label className="form-label">Customer ID</label>
              <input
                className="form-input"
                value={form.customerId}
                onChange={(e) => setField("customerId", e.target.value)}
                placeholder="Customer ID"
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 24,
              marginTop: 16,
            }}
          >
            <div>
              <label className="form-label">Service</label>
              <input
                className="form-input"
                value={form.service}
                onChange={(e) => setField("service", e.target.value)}
                placeholder="Service name"
              />
            </div>
            <div>
              <label className="form-label">Therapist</label>
              <input
                className="form-input"
                value={form.therapist}
                onChange={(e) => setField("therapist", e.target.value)}
                placeholder="Therapist name"
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              marginTop: 16,
            }}
          >
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-input"
                value={form.time}
                onChange={(e) => setField("time", e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label className="form-label">Notes</label>
            <textarea
              className="form-input"
              style={{ minHeight: 110 }}
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Add any appointment notes"
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 24,
            }}
          >
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(`/appointments/${id}`)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
