"use client";

import React, { useState } from "react";
import { X, UserPlus, Plus } from "lucide-react";
import AddCustomerModal from "./AddCustomerModal";

const SERVICES = [
  "Detoxifying Clay Mask Facial",
  "Aromatherapy Full Body Spa",
  "Lamination Brow Architecture",
];
const STAFF_LIST = ["Staff Name 1", "Staff Name 2", "Staff Name 3"];

export default function NewBookingModal({ onClose }) {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [form, setForm] = useState({
    customer: "",
    email: "",
    phone: "",
    date: "2026-05-26",
    time: "9:00 AM",
    staff: "",
    remarks: "",
    service: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  if (showAddCustomer) {
    return (
      <AddCustomerModal
        onClose={() => setShowAddCustomer(false)}
        onBack={() => setShowAddCustomer(false)}
      />
    );
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: 2,
                }}
              >
                New Booking
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 600,
                  color: "var(--dark)",
                }}
              >
                Add New Appointment
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                marginTop: 2,
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          className="drawer-body"
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          {/* Customer */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <label className="form-label" style={{ marginBottom: 0 }}>
                Customer
              </label>
              <button
                onClick={() => setShowAddCustomer(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--brown)",
                  fontSize: 11,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                }}
              >
                <UserPlus size={12} /> + New Customer
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <select
                className="form-select"
                value={form.customer}
                onChange={(e) => set("customer", e.target.value)}
              >
                <option value="">Select Customer.......</option>
                <option>John Doe</option>
                <option>Jane Smith</option>
              </select>
            </div>
          </div>

          {/* Email & Phone */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label className="form-label">Email</label>
              <input
                className="form-input"
                placeholder="Auto show when name choose"
                value={form.email}
                readOnly
              />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input
                className="form-input"
                placeholder="Auto show when name choose"
                value={form.phone}
                readOnly
              />
            </div>
          </div>

          {/* Date & Time */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label className="form-label">Appointment Date</label>
              <input
                type="date"
                className="form-input"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Appointment Time</label>
              <select
                className="form-select"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
              >
                {[
                  "9:00 AM",
                  "9:30 AM",
                  "10:00 AM",
                  "10:30 AM",
                  "11:00 AM",
                  "2:00 PM",
                  "3:00 PM",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Staff */}
          <div>
            <label className="form-label">Choose Staff</label>
            <select
              className="form-select"
              value={form.staff}
              onChange={(e) => set("staff", e.target.value)}
            >
              <option value="">Select Staff ....</option>
              {STAFF_LIST.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="form-label">Remarks</label>
            <textarea
              className="form-input"
              style={{ resize: "none", height: 70 }}
              placeholder="Enter any remarks......"
              value={form.remarks}
              onChange={(e) => set("remarks", e.target.value)}
            />
          </div>

          {/* Appointment Items */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <label className="form-label" style={{ marginBottom: 0 }}>
                Appointment Items
              </label>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--brown)",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                }}
              >
                + Add Row
              </button>
            </div>
            <div
              style={{
                border: "1px solid #E0D8D0",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  background: "#FDFAF8",
                  borderBottom: "1px solid #E0D8D0",
                }}
              >
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Product / Services
                </label>
              </div>
              <div style={{ padding: "8px 12px" }}>
                <select
                  className="form-select"
                  value={form.service}
                  onChange={(e) => set("service", e.target.value)}
                >
                  <option value="">Select Product or Service....</option>
                  {SERVICES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div
            style={{
              background: "#FFF8F0",
              border: "1px solid #F0E0C8",
              borderRadius: 10,
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}
            >
              GRAND TOTAL
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#4CAF50" }}>
              NRS 15000
            </span>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-submit">Create Appointment</button>
        </div>
      </div>
    </>
  );
}
