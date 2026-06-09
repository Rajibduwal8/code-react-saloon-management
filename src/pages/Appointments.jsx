"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Calendar, EditIcon, EyeIcon, Plus, Search, Trash2Icon } from "lucide-react";
import NewBookingModal from "../components/modals/NewBookingModal";
import AddCustomerModal from "../components/modals/AddCustomerModal";
import { getAppointments, deleteAppointment } from "../services/appointmentService";
import { DataTable } from "../components/common/DataTable";

export default function Appointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);

  const fetchAppointments = async (page, size) => {
    setLoading(true);
    try {
      const data = await getAppointments(page + 1, size);
      if (Array.isArray(data)) {
        setAppointments(data);
        setPageCount(1);
      } else {
        setAppointments(data.items || []);
        setPageCount(data.totalPages || Math.ceil((data.totalCount || 0) / size) || 1);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(pageIndex, pageSize); }, [pageIndex, pageSize]);

  const handlePaginationChange = (updater) => {
    const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
    setPageIndex(newState.pageIndex);
    setPageSize(newState.pageSize);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteAppointment(id);
      fetchAppointments(pageIndex, pageSize);
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const columns = useMemo(() => [
    {
      header: "Entity Mode", id: "entityMode",
      cell: (info) => <span style={{ fontWeight: 600, color: "var(--dark)", fontSize: 12 }}>{info.row.original.customerId ? "CLIENT" : "STUDENT"}</span>,
    },
    { header: "Customer", accessorKey: "customerName", cell: (info) => <span style={{ fontWeight: 500, fontSize: 12 }}>{info.getValue()}</span> },
    {
      header: "Date & Time", id: "datetime",
      cell: (info) => <span style={{ fontSize: 12 }}>{info.row.original.date} {info.row.original.time}</span>,
    },
    { header: "Treatments / Items", accessorKey: "service", cell: (info) => <span style={{ whiteSpace: "pre-line", fontSize: 12 }}>{info.getValue()}</span> },
    {
      header: "Payment", id: "payment",
      cell: (info) => <span className="badge-paid">{info.row.original.status || "N/A"}</span>,
    },
    { header: "Remarks", accessorKey: "notes", cell: (info) => <span style={{ fontSize: 12, color: "var(--muted)" }}>{info.getValue() || "—"}</span> },
    { header: "Items", id: "items", cell: () => <span style={{ textAlign: "center" }}>1</span> },
    {
      header: "Status", accessorKey: "status",
      cell: (info) => <span style={{ fontSize: 11, fontWeight: 700, color: "#4CAF50" }}>{info.getValue()}</span>,
    },
    {
      header: "Action", id: "actions",
      cell: (info) => {
        const id = info.row.original.id;
        return (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => router.push(`/appointments/${id}`)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4CAF50" }}><EyeIcon size={13} /></button>
            <button onClick={() => router.push(`/appointments/${id}/edit`)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--warm)" }}><EditIcon size={13} /></button>
            <button onClick={() => handleDelete(id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E05C5C" }}><Trash2Icon size={13} /></button>
          </div>
        );
      },
    },
  ], [router]);

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="page-title">Appointment List</div>
            <div className="page-subtitle">Manage your customer appointments</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid var(--sand)", borderRadius: 8, padding: "7px 12px", background: "white", fontSize: 12, color: "var(--muted)" }}>
              <Calendar size={13} /> 2026-04-26 to 2026-...
            </div>
            <button className="btn-primary" onClick={() => setShowBooking(true)}><Plus size={13} /> Add Appointment</button>
            <button className="btn-outline" onClick={() => setShowCustomer(true)}><Plus size={13} /> Add Customer</button>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 28px 0" }}>
        <div style={{ background: "white", border: "1px solid var(--sand)", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <div className="search-bar" style={{ minWidth: 220 }}>
              <Search size={13} color="var(--muted)" />
              <input placeholder="Search ............" />
            </div>
          </div>
          <DataTable columns={columns} data={appointments} pageCount={pageCount} pageIndex={pageIndex} pageSize={pageSize} onPaginationChange={handlePaginationChange} loading={loading} />
        </div>
      </div>

      {showBooking && <NewBookingModal onClose={() => setShowBooking(false)} />}
      {showCustomer && <AddCustomerModal onClose={() => setShowCustomer(false)} />}
    </div>
  );
}
