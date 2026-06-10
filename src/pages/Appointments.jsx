import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
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
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import AppointmentService from "../services/OrderingServices/AppointmentService";
import {
  formatAppointmentDateTime,
  formatPaymentStatus,
  getStatusColor,
  getPaymentColor,
  startOfMonthIso,
  endOfMonthIso,
  toDateInputValue,
  toDateTimeRangeIso,
} from "../utils/appointmentUtils";

const tableStyles = {
  table: { style: { backgroundColor: "transparent" } },
  headRow: {
    style: {
      backgroundColor: "transparent",
      borderBottom: "1px solid var(--sand)",
      minHeight: "44px",
    },
  },
  headCells: {
    style: {
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--muted)",
      paddingLeft: "14px",
      paddingRight: "14px",
    },
  },
  rows: {
    style: {
      borderBottom: "1px solid #F2EDE8",
      minHeight: "48px",
      "&:hover": { backgroundColor: "#FDFAF8" },
    },
  },
  cells: {
    style: {
      fontSize: "12.5px",
      paddingLeft: "14px",
      paddingRight: "14px",
      color: "var(--text)",
    },
  },
  pagination: {
    style: {
      borderTop: "1px solid #F2EDE8",
      fontSize: "12px",
      color: "var(--muted)",
    },
  },
};

export default function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState(toDateInputValue(startOfMonthIso()));
  const [toDate, setToDate] = useState(toDateInputValue(endOfMonthIso()));
  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime] = useState("23:59");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const { from, to } = toDateTimeRangeIso(
        fromDate,
        fromTime,
        toDate,
        toTime,
      );
      const data = await AppointmentService.getList({ from, to });
      setAppointments(Array.isArray(data) ? data : data?.items || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [fromDate, fromTime, toDate, toTime]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, fromDate, fromTime, toDate, toTime]);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
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
  }, [appointments, search]);

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

  const columns = [
    {
      name: "Customer",
      selector: (row) => row.customerName,
      sortable: true,
      cell: (row) => (
        <span style={{ fontWeight: 500 }}>{row.customerName || "—"}</span>
      ),
      minWidth: "140px",
    },
    {
      name: "Date and Time",
      cell: (row) => {
        const { date, time } = formatAppointmentDateTime(row.appointmentDateTime);
        return (
          <span style={{ whiteSpace: "pre-line", fontSize: 12 }}>
            {`${date}\n${time}`}
          </span>
        );
      },
      minWidth: "120px",
    },
    {
      name: "Treatments / Item Details",
      cell: (row) => {
        const treatments = (row.details || []).map((d) => d.productName).join("\n");
        return (
          <span
            style={{ whiteSpace: "pre-line", fontSize: 12, maxWidth: 220 }}
          >
            {treatments || "—"}
          </span>
        );
      },
      grow: 2,
    },
    {
      name: "Payment",
      cell: (row) => (
        <span
          className="badge-paid"
          style={{
            background:
              formatPaymentStatus(row.paymentStatus).toLowerCase() === "paid"
                ? "#E8F5E9"
                : "#FFF3E0",
            color: getPaymentColor(row.paymentStatus),
          }}
        >
          {formatPaymentStatus(row.paymentStatus)}
        </span>
      ),
      width: "100px",
    },
    {
      name: "Remarks",
      selector: (row) => row.remarks,
      cell: (row) => (
        <span style={{ fontSize: 12, color: "var(--muted)", maxWidth: 160 }}>
          {row.remarks || "—"}
        </span>
      ),
    },
    {
      name: "Items",
      selector: (row) => row.details?.length || 0,
      center: true,
      width: "70px",
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: getStatusColor(row.status),
          }}
        >
          {row.status || "—"}
        </span>
      ),
      width: "100px",
    },
    {
      name: "Action",
      cell: (row) => {
        const canComplete =
          String(row.status).toLowerCase() === "booked";
        return (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => navigate(`/appointments/${row.id}`)}
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
                onClick={() => navigate(`/appointments/${row.id}/complete`)}
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
              onClick={() => navigate(`/appointments/${row.id}/edit`)}
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
              onClick={() => handleDelete(row.id)}
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
        );
      },
      width: "120px",
      right: true,
    },
  ];

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
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-brand-sand bg-white px-2.5 py-1.5 text-xs">
              <Calendar size={13} className="text-stone-400 shrink-0" />
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-7 w-auto border-0 p-0 text-xs shadow-none focus-visible:ring-0"
              />
              <Input
                type="time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                className="h-7 w-auto border-0 p-0 text-xs shadow-none focus-visible:ring-0"
              />
              <span className="text-stone-400 text-[11px]">to</span>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-7 w-auto border-0 p-0 text-xs shadow-none focus-visible:ring-0"
              />
              <Input
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                className="h-7 w-auto border-0 p-0 text-xs shadow-none focus-visible:ring-0"
              />
            </div>
            <Button onClick={() => setShowBooking(true)}>
              <Plus size={13} /> Add Appointment
            </Button>
            <Button variant="outline" onClick={() => setShowCustomer(true)}>
              <Plus size={13} /> Add Customer
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-7 pt-4">
        <Card className="overflow-hidden [&_.rdt_TableRow:hover]:!bg-[#FDFAF8]">
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[#F2EDE8] px-4 py-3.5">
            <span className="text-xs text-stone-500">
              Showing {filtered.length} appointment
              {filtered.length !== 1 ? "s" : ""}
            </span>
            <div className="search-bar min-w-[220px]">
              <Search size={13} color="var(--muted)" />
              <input
                placeholder="Search customer, service, remarks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={filtered}
            progressPending={loading}
            pagination
            paginationServer={false}
            paginationTotalRows={filtered.length}
            paginationPerPage={perPage}
            paginationDefaultPage={currentPage}
            onChangePage={setCurrentPage}
            onChangeRowsPerPage={(newPerPage, page) => {
              setPerPage(newPerPage);
              setCurrentPage(page);
            }}
            paginationRowsPerPageOptions={[10, 20, 50]}
            highlightOnHover
            responsive
            customStyles={tableStyles}
            noDataComponent={
              <div
                style={{
                  padding: 24,
                  color: "var(--muted)",
                  fontSize: 14,
                }}
              >
                No appointments found.
              </div>
            }
          />
          </CardContent>
        </Card>
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
