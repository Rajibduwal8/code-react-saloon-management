import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  EditIcon,
  EyeIcon,
  Plus,
  Search,
  Trash2Icon,
} from "lucide-react";
import Pagination from "../components/ui/Pagination";
import NewBookingModal from "../components/modals/NewBookingModal";
import AddCustomerModal from "../components/modals/AddCustomerModal";
import {
  getAppointments,
  deleteAppointment,
} from "../services/appointmentService";

export default function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Error loading appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteAppointment(id);
      setAppointments((current) =>
        current.filter((item) => String(item.id) !== String(id)),
      );
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

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
            <div className="page-title">Appointment List</div>
            <div className="page-subtitle">
              Manage your customer appointment
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                border: "1px solid var(--sand)",
                borderRadius: 8,
                padding: "7px 12px",
                background: "white",
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              <Calendar size={13} />
              2026-04-26 to 2026-...
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowBooking(true)}
            >
              <Plus size={13} /> Add Appointment
            </button>
            <button
              className="btn-outline"
              onClick={() => setShowCustomer(true)}
            >
              <Plus size={13} /> Add Customer
            </button>
          </div>
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
          {/* Search */}
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "flex-end",
              borderBottom: "1px solid #F2EDE8",
            }}
          >
            <div className="search-bar" style={{ minWidth: 220 }}>
              <Search size={13} color="var(--muted)" />
              <input placeholder="Search ............" />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  {[
                    "Entity Mode",
                    "Customer",
                    "Date and Time",
                    "Treatments / Item Details",
                    "Payment",
                    "Remarks",
                    "Items",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        textAlign: "center",
                        padding: 20,
                        color: "var(--muted)",
                      }}
                    >
                      Loading appointments...
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        textAlign: "center",
                        padding: 20,
                        color: "var(--muted)",
                      }}
                    >
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td
                        style={{
                          fontWeight: 600,
                          color: "var(--dark)",
                          fontSize: 12,
                        }}
                      >
                        {appointment.customerId ? "CLIENT" : "STUDENT"}
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        {appointment.customerName}
                      </td>
                      <td
                        style={{ whiteSpace: "pre-line", fontSize: 12 }}
                      >{`${appointment.date} ${appointment.time}`}</td>
                      <td style={{ whiteSpace: "pre-line", fontSize: 12 }}>
                        {appointment.service}
                      </td>
                      <td>
                        <span className="badge-paid">
                          {appointment.status || "N/A"}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: "var(--muted)" }}>
                        {appointment.notes || "—"}
                      </td>
                      <td style={{ textAlign: "center" }}>1</td>
                      <td>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#4CAF50",
                          }}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() =>
                              navigate(`/appointments/${appointment.id}`)
                            }
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#4CAF50",
                              fontSize: 14,
                            }}
                          >
                            <EyeIcon size={13} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/appointments/${appointment.id}/edit`)
                            }
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "var(--warm)",
                              fontSize: 14,
                            }}
                          >
                            <EditIcon size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#E05C5C",
                              fontSize: 14,
                            }}
                          >
                            <Trash2Icon size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination />
        </div>
      </div>

      {showBooking && <NewBookingModal onClose={() => setShowBooking(false)} />}
      {showCustomer && (
        <AddCustomerModal onClose={() => setShowCustomer(false)} />
      )}
    </div>
  );
}
