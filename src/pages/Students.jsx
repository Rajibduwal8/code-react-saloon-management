"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EditIcon, Eye, Plus, Trash2Icon } from "lucide-react";
import EnrollStudentModal from "../components/modals/EnrollStudentModal";
import { getStudents, deleteStudent } from "../services/studentService";
import { DataTable } from "../components/common/DataTable";

export default function Students() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);

  const fetchStudents = async (page, size) => {
    setLoading(true);
    try {
      const data = await getStudents(page + 1, size);
      if (Array.isArray(data)) {
        setStudents(data);
        setPageCount(1);
      } else {
        setStudents(data.items || []);
        setPageCount(data.totalPages || Math.ceil((data.totalCount || 0) / size) || 1);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(pageIndex, pageSize); }, [pageIndex, pageSize]);

  const handlePaginationChange = (updater) => {
    const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
    setPageIndex(newState.pageIndex);
    setPageSize(newState.pageSize);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        fetchStudents(pageIndex, pageSize);
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const columns = useMemo(() => [
    {
      header: "Student Info", id: "studentInfo",
      cell: (info) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 12, color: "var(--dark)" }}>{info.row.original.name}</div>
          <div style={{ fontSize: 10, color: "var(--muted)" }}>{info.row.original.studentId}</div>
        </div>
      ),
    },
    { header: "Course Details", accessorKey: "course", cell: (info) => <span style={{ fontWeight: 500, fontSize: 12 }}>{info.getValue()}</span> },
    { header: "Address", accessorKey: "address", cell: (info) => <span style={{ fontSize: 12 }}>{info.getValue()}</span> },
    { header: "Mobile", accessorKey: "mobile", cell: (info) => <span style={{ fontSize: 12 }}>{info.getValue()}</span> },
    { header: "Email", accessorKey: "email", cell: (info) => <span style={{ fontSize: 11, color: "var(--muted)" }}>{info.getValue()}</span> },
    {
      header: "Timeline Info", id: "timeline",
      cell: (info) => (
        <div>
          <div style={{ fontSize: 11 }}>START: {info.row.original.startDate}</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>DURATION: {info.row.original.duration} DAYS</div>
        </div>
      ),
    },
    { header: "National ID", accessorKey: "nationalId", cell: (info) => <span style={{ fontSize: 12 }}>{info.getValue()}</span> },
    {
      header: "Status", accessorKey: "status",
      cell: (info) => <span style={{ fontSize: 11, fontWeight: 700, color: "#4CAF50" }}>{info.getValue()}</span>,
    },
    { header: "Balance", accessorKey: "balance", cell: (info) => <span style={{ textAlign: "center", fontWeight: 600 }}>{info.getValue()}</span> },
    {
      header: "Action", id: "actions",
      cell: (info) => {
        const id = info.row.original.id;
        return (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => router.push(`/students/${id}`)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4CAF50" }} title="View"><Eye size={13} /></button>
            <button onClick={() => router.push(`/students/${id}/edit`)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--warm)" }} title="Edit"><EditIcon size={13} /></button>
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
            <div className="page-title">Student Enrollment Log</div>
            <div className="page-subtitle">Manage vocational courses, category classifications, and track student payment logs, communication logs, and issue certificates.</div>
          </div>
          <button className="btn-outline" onClick={() => setShowModal(true)}><Plus size={13} /> New Enrollment</button>
        </div>
      </div>

      <div style={{ padding: "16px 28px 0" }}>
        <div style={{ background: "white", border: "1px solid var(--sand)", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Student Enrollments & Logs</div>
            <div className="search-bar" style={{ minWidth: 220 }}><input placeholder="Search Student with Name / Id" /></div>
          </div>
          <DataTable columns={columns} data={students} pageCount={pageCount} pageIndex={pageIndex} pageSize={pageSize} onPaginationChange={handlePaginationChange} loading={loading} />
        </div>
      </div>

      {showModal && <EnrollStudentModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchStudents(pageIndex, pageSize); }} />}
    </div>
  );
}
