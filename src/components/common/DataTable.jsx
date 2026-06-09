import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export function DataTable({
  columns,
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPaginationChange,
  loading = false,
}) {
  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            <thead style={{ backgroundColor: "#f8fafc", color: "#475569" }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        padding: "12px 16px",
                        fontWeight: 600,
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#64748b",
                    }}
                  >
                    Loading data...
                  </td>
                </tr>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{ padding: "12px 16px", color: "#334155" }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#64748b",
                    }}
                  >
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          padding: "0 4px",
        }}
      >
        <div style={{ fontSize: "14px", color: "#64748b", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Rows per page:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              color: "#334155",
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "14px", color: "#64748b" }}>
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              style={{
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                backgroundColor: table.getCanPreviousPage() ? "#fff" : "#f8fafc",
                color: table.getCanPreviousPage() ? "#334155" : "#cbd5e1",
                cursor: table.getCanPreviousPage() ? "pointer" : "not-allowed",
              }}
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              style={{
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                backgroundColor: table.getCanPreviousPage() ? "#fff" : "#f8fafc",
                color: table.getCanPreviousPage() ? "#334155" : "#cbd5e1",
                cursor: table.getCanPreviousPage() ? "pointer" : "not-allowed",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              style={{
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                backgroundColor: table.getCanNextPage() ? "#fff" : "#f8fafc",
                color: table.getCanNextPage() ? "#334155" : "#cbd5e1",
                cursor: table.getCanNextPage() ? "pointer" : "not-allowed",
              }}
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              style={{
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                backgroundColor: table.getCanNextPage() ? "#fff" : "#f8fafc",
                color: table.getCanNextPage() ? "#334155" : "#cbd5e1",
                cursor: table.getCanNextPage() ? "pointer" : "not-allowed",
              }}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
