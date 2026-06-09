"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EditIcon, Eye, Plus, Trash2Icon } from "lucide-react";
import AddCustomerModal from "../components/modals/AddCustomerModal";
import { getClients, deleteClient } from "../services/clientService";
import { DataTable } from "../components/common/DataTable";

export default function Client() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);

  const fetchClients = async (page, size) => {
    setLoading(true);
    try {
      // API typically uses 1-based indexing for Page, so we add 1 to pageIndex
      const data = await getClients(page + 1, size);
      
      // Handle standard paginated response vs array (mock)
      if (Array.isArray(data)) {
        setClients(data);
        setPageCount(1);
      } else {
        setClients(data.items || []);
        // Assuming API returns totalPages, or we calculate it from totalCount
        setPageCount(data.totalPages || Math.ceil((data.totalCount || 0) / size) || 1);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const handlePaginationChange = (updater) => {
    const newState = typeof updater === "function" 
      ? updater({ pageIndex, pageSize }) 
      : updater;
    setPageIndex(newState.pageIndex);
    setPageSize(newState.pageSize);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteClient(id);
        fetchClients(pageIndex, pageSize);
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleAddSuccess = () => {
    setShowModal(false);
    fetchClients(pageIndex, pageSize);
  };

  const columns = useMemo(
    () => [
      {
        header: "Customer",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: "customer",
        cell: (info) => (
          <div>
            <div style={{ fontWeight: 600, fontSize: 12, color: "var(--dark)" }}>
              {info.getValue()}
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>
              {info.row.original.nationalId || "N/A"}
            </div>
          </div>
        ),
      },
      {
        header: "Phone",
        accessorKey: "phone",
        cell: (info) => <span style={{ fontSize: 12 }}>{info.getValue()}</span>,
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: (info) => <span style={{ fontSize: 11, color: "var(--muted)" }}>{info.getValue()}</span>,
      },
      {
        header: "Skin Type",
        accessorKey: "skin",
        cell: (info) => <span style={{ fontSize: 12 }}>{info.getValue() || "N/A"}</span>,
      },
      {
        header: "Registered Date",
        accessorKey: "registeredDate",
        cell: (info) => <span style={{ fontSize: 12 }}>{info.getValue() || "N/A"}</span>,
      },
      {
        header: "Action",
        id: "actions",
        cell: (info) => {
          const id = info.row.original.id;
          return (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => router.push(`/clients/${id}`)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#4CAF50", fontSize: 14 }}
                title="View"
              >
                <Eye size={13} />
              </button>
              <button
                onClick={() => router.push(`/clients/${id}/edit`)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--warm)", fontSize: 14 }}
                title="Edit"
              >
                <EditIcon size={13} />
              </button>
              <button
                onClick={() => handleDelete(id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#E05C5C", fontSize: 14 }}
                title="Delete"
              >
                <Trash2Icon size={13} />
              </button>
            </div>
          );
        },
      },
    ],
    [router]
  );

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="page-title">Client Enrollment Log</div>
            <div className="page-subtitle">
              Manage vocational courses, category classifications, and track client payment logs, communication logs, and issue certificates.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={13} /> Add Customer
            </button>
            <button className="btn-outline">
              <Plus size={13} /> New Booking
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 28px 0" }}>
        <div style={{ background: "white", border: "1px solid var(--sand)", borderRadius: 12, padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Client List
            </div>
            <div className="search-bar" style={{ minWidth: 220 }}>
              <input placeholder="Search Client with Name / Id" />
            </div>
          </div>
          
          <DataTable
            columns={columns}
            data={clients}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
            loading={loading}
          />
        </div>
      </div>

      {showModal && (
        <AddCustomerModal
          onClose={() => setShowModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
}
