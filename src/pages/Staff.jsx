"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EditIcon, Eye, Plus, Trash2Icon } from "lucide-react";
import StaffModal from "../components/modals/StaffModal";
import { getStaff, deleteStaff } from "../services/staffService";
import { DataTable } from "../components/common/DataTable";

export default function Staff() {
  const router = useRouter();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);

  const fetchStaff = async (page, size) => {
    setLoading(true);
    try {
      const data = await getStaff(page + 1, size);
      if (Array.isArray(data)) {
        setStaffList(data);
        setPageCount(1);
      } else {
        setStaffList(data.items || []);
        setPageCount(data.totalPages || Math.ceil((data.totalCount || 0) / size) || 1);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(pageIndex, pageSize); }, [pageIndex, pageSize]);

  const handlePaginationChange = (updater) => {
    const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
    setPageIndex(newState.pageIndex);
    setPageSize(newState.pageSize);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaff(id);
        fetchStaff(pageIndex, pageSize);
      } catch (error) {
        console.error("Error deleting staff:", error);
      }
    }
  };

  const columns = useMemo(() => [
    {
      header: "Name",
      id: "name",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      cell: (info) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 12, color: "var(--dark)" }}>{info.getValue()}</div>
          <div style={{ fontSize: 10, color: "var(--muted)" }}>ID: {info.row.original.id}</div>
        </div>
      ),
    },
    { header: "Position", accessorKey: "position", cell: (info) => <span style={{ fontWeight: 500, fontSize: 12 }}>{info.getValue()}</span> },
    { header: "Department", accessorKey: "department", cell: (info) => <span style={{ fontSize: 12 }}>{info.getValue()}</span> },
    { header: "Email", accessorKey: "email", cell: (info) => <span style={{ fontSize: 11, color: "var(--muted)" }}>{info.getValue()}</span> },
    { header: "Phone", accessorKey: "phone", cell: (info) => <span style={{ fontSize: 12 }}>{info.getValue()}</span> },
    {
      header: "Status", accessorKey: "status",
      cell: (info) => <span style={{ fontSize: 11, fontWeight: 700, color: "#4CAF50" }}>{info.getValue()}</span>,
    },
    { header: "Salary", accessorKey: "salary", cell: (info) => <span style={{ fontWeight: 600, fontSize: 12 }}>NRS {info.getValue()}</span> },
    {
      header: "Action", id: "actions",
      cell: (info) => {
        const id = info.row.original.id;
        return (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => router.push(`/staff/${id}`)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4CAF50" }} title="View"><Eye size={13} /></button>
            <button onClick={() => router.push(`/staff/${id}/edit`)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--warm)" }} title="Edit"><EditIcon size={13} /></button>
            <button onClick={() => handleDelete(id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E05C5C" }} title="Delete"><Trash2Icon size={13} /></button>
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
            <div className="page-title">Staff & Payroll</div>
            <div className="page-subtitle">Manage staff information, roles, departments, and payroll details.</div>
          </div>
          <button className="btn-outline" onClick={() => setShowModal(true)}><Plus size={13} /> Add Staff</button>
        </div>
      </div>

      <div style={{ padding: "16px 28px 0" }}>
        <div style={{ background: "white", border: "1px solid var(--sand)", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Staff Members</div>
            <div className="search-bar" style={{ minWidth: 220 }}><input placeholder="Search Staff with Name / Email" /></div>
          </div>
          <DataTable columns={columns} data={staffList} pageCount={pageCount} pageIndex={pageIndex} pageSize={pageSize} onPaginationChange={handlePaginationChange} loading={loading} />
        </div>
      </div>

      {showModal && <StaffModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchStaff(pageIndex, pageSize); }} />}
    </div>
  );
}
