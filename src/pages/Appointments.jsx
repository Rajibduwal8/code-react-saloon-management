import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  EditIcon,
  EyeIcon,
  Plus,
  Search,
  Trash2Icon,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import NewBookingModal from "../components/modals/NewBookingModal";
import AddCustomerModal from "../components/modals/AddCustomerModal";
import AppointmentService from "../services/OrderingServices/AppointmentService";
import {
  formatAppointmentDateTime,
  formatPaymentStatus,
  getStatusColor,
  getPaymentColor,
  startOfMonthIso,
  endOfMonthIso,
  toDateInputValue,
} from "../utils/appointmentUtils";

export default function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState(toDateInputValue(startOfMonthIso()));
  const [toDate, setToDate] = useState(toDateInputValue(endOfMonthIso()));

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const from = fromDate
        ? new Date(`${fromDate}T00:00:00`).toISOString()
        : startOfMonthIso();
      const to = toDate
        ? new Date(`${toDate}T23:59:59`).toISOString()
        : endOfMonthIso();
      const data = await AppointmentService.getList({ from, to });
      setAppointments(Array.isArray(data) ? data : data?.items || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const filtered = appointments.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const treatments = (a.details || [])
      .map((d) => d.productName)
      .join(" ")
      .toLowerCase();
    return (
      a.customerName?.toLowerCase().includes(q) ||
      a.remarks?.toLowerCase().includes(q) ||
      String(a.status || "").toLowerCase().includes(q) ||
      treatments.includes(q)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await AppointmentService.delete(id);
      toast.success("Appointment deleted");
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment");
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
              Manage your customer appointments
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                border: "1px solid var(--sand)",
                borderRadius: 8,
                padding: "5px 10px",
                background: "white",
                fontSize: 12,
              }}
            >
              <Calendar size={13} color="var(--muted)" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: 12,
                  fontFamily: "DM Sans, sans-serif",
                  color: "var(--dark)",
                }}
              />
              <span style={{ color: "var(--muted)" }}>to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: 12,
                  fontFamily: "DM Sans, sans-serif",
                  color: "var(--dark)",
                }}
              />
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
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #F2EDE8",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              Showing {filtered.length} appointment
              {filtered.length !== 1 ? "s" : ""}
            </span>
            <div className="search-bar" style={{ minWidth: 220 }}>
              <Search size={13} color="var(--muted)" />
              <input
                placeholder="Search customer, service, remarks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  {[
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
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: 20,
                        color: "var(--muted)",
                      }}
                    >
                      Loading appointments...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
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
                  filtered.map((appointment) => {
                    const { date, time } = formatAppointmentDateTime(
                      appointment.appointmentDateTime,
                    );
                    const treatments = (appointment.details || [])
                      .map((d) => d.productName)
                      .join("\n");
                    const canComplete =
                      String(appointment.status).toLowerCase() === "booked";

                    return (
                      <tr key={appointment.id}>
                        <td style={{ fontWeight: 500 }}>
                          {appointment.customerName || "—"}
                        </td>
                        <td
                          style={{ whiteSpace: "pre-line", fontSize: 12 }}
                        >{`${date}\n${time}`}</td>
                        <td
                          style={{
                            whiteSpace: "pre-line",
                            fontSize: 12,
                            maxWidth: 220,
                          }}
                        >
                          {treatments || "—"}
                        </td>
                        <td>
                          <span
                            className="badge-paid"
                            style={{
                              background:
                                formatPaymentStatus(
                                  appointment.paymentStatus,
                                ).toLowerCase() === "paid"
                                  ? "#E8F5E9"
                                  : "#FFF3E0",
                              color: getPaymentColor(appointment.paymentStatus),
                            }}
                          >
                            {formatPaymentStatus(appointment.paymentStatus)}
                          </span>
                        </td>
                        <td
                          style={{
                            fontSize: 12,
                            color: "var(--muted)",
                            maxWidth: 160,
                          }}
                        >
                          {appointment.remarks || "—"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {appointment.details?.length || 0}
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: getStatusColor(appointment.status),
                            }}
                          >
                            {appointment.status || "—"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={() =>
                                navigate(`/appointments/${appointment.id}`)
                              }
                              title="View"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#4CAF50",
                              }}
                            >
                              <EyeIcon size={13} />
                            </button>
                            {canComplete && (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/appointments/${appointment.id}/complete`,
                                  )
                                }
                                title="Complete"
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#3B82F6",
                                }}
                              >
                                <CheckCircle size={13} />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                navigate(
                                  `/appointments/${appointment.id}/edit`,
                                )
                              }
                              title="Edit"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--warm)",
                              }}
                            >
                              <EditIcon size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(appointment.id)}
                              title="Delete"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#E05C5C",
                              }}
                            >
                              <Trash2Icon size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showBooking && (
        <NewBookingModal
          onClose={() => setShowBooking(false)}
          onSuccess={() => {
            setShowBooking(false);
            fetchAppointments();
          }}
        />
      )}
      {showCustomer && (
        <AddCustomerModal onClose={() => setShowCustomer(false)} />
      )}
    </div>
  );
}
