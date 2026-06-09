import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({
  current = 1,
  total = 1,
  perPage = 10,
  onPageChange,
  onPerPageChange,
}) {
  const handlePrev = () => {
    if (current > 1) onPageChange(current - 1);
  };

  const handleNext = () => {
    if (current < total) onPageChange(current + 1);
  };

  // Generate pagination range
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(total, current + 2);

    if (current <= 3) {
      endPage = Math.min(total, 5);
    }
    if (current >= total - 2) {
      startPage = Math.max(1, total - 4);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < total) {
      if (endPage < total - 1) pages.push("...");
      pages.push(total);
    }

    return pages;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        padding: "16px 28px",
        borderTop: "1px solid #F2EDE8",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>
          Rows per page:
        </span>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          style={{
            padding: "4px 8px",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
            fontSize: "13px",
            color: "var(--dark)",
            background: "white",
            cursor: "pointer",
          }}
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          onClick={() => onPageChange(1)}
          disabled={current === 1}
          className={`page-btn ${current === 1 ? "disabled" : ""}`}
          style={{ padding: "6px", cursor: current === 1 ? "not-allowed" : "pointer" }}
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          onClick={handlePrev}
          disabled={current === 1}
          className={`page-btn ${current === 1 ? "disabled" : ""}`}
          style={{ padding: "6px", cursor: current === 1 ? "not-allowed" : "pointer" }}
        >
          <ChevronLeft size={14} />
        </button>

        {getPageNumbers().map((p, i) => (
          <button
            key={i}
            onClick={() => typeof p === "number" && onPageChange(p)}
            className={`page-btn ${p === current ? "active" : ""}`}
            style={{
              padding: "6px 12px",
              cursor: typeof p === "number" ? "pointer" : "default",
              background: p === current ? "var(--brown)" : "white",
              color: p === current ? "white" : "var(--dark)",
              fontWeight: p === current ? 600 : 400,
            }}
          >
            {p}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={current === total || total === 0}
          className={`page-btn ${current === total || total === 0 ? "disabled" : ""}`}
          style={{
            padding: "6px",
            cursor: current === total || total === 0 ? "not-allowed" : "pointer",
          }}
        >
          <ChevronRight size={14} />
        </button>
        <button
          onClick={() => onPageChange(total)}
          disabled={current === total || total === 0}
          className={`page-btn ${current === total || total === 0 ? "disabled" : ""}`}
          style={{
            padding: "6px",
            cursor: current === total || total === 0 ? "not-allowed" : "pointer",
          }}
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}
