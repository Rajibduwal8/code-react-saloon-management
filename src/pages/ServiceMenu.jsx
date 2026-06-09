"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2 } from "lucide-react";
import Link from "next/link";
import { getProducts } from "../services/productService";
import Pagination from "../components/ui/Pagination";

const PAGE_SIZE = 12;

export default function ServiceMenu() {
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [perPage, setPerPage] = useState(PAGE_SIZE);

  const fetchServices = async (currentPage, currentPerPage) => {
    setLoading(true);
    try {
      const data = await getProducts(currentPage, currentPerPage);
      if (Array.isArray(data)) {
        setServices(data);
        setPageCount(1);
      } else {
        setServices(data.items || []);
        setPageCount(data.totalPages || Math.ceil((data.totalCount || 0) / currentPerPage) || 1);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(page, perPage);
  }, [page, perPage]);

  const filtered = services.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="page-title">Treatment & Product Menu</div>
            <div className="page-subtitle">
              Curate luxury formulations, products, pricing, session parameters, and categories.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="search-bar">
              <Search size={13} color="var(--muted)" />
              <input
                placeholder="Search ............"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link href="/service-menu/new" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <Plus size={13} /> Add Services
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 28px 0" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
            Loading services...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
            No services found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {filtered.map((s, i) => (
              <div key={i} className="service-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ background: "var(--sand)", color: "var(--brown)", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "3px 8px", letterSpacing: "0.04em" }}>
                    {s.duration || "60 MIN"}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--dark)" }}>
                    NPR {s.price?.toLocaleString() || 0}
                  </span>
                </div>
                <div style={{ fontFamily: "Playfair Display, serif", fontSize: 15, fontWeight: 600, color: "var(--dark)", marginBottom: 4 }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>
                  {s.description || "No description provided."}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>Code: {s.code || "N/A"}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 14 }}>SKU: {s.sku || "N/A"}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--sand)", paddingTop: 10 }}>
                  <span style={{ fontSize: 11, color: s.isProductSoldOut ? "#e53e3e" : "#4CAF50", fontWeight: 600 }}>
                    • {s.isProductSoldOut ? "SOLD OUT" : s.isHidden ? "HIDDEN" : "ACTIVE"}
                  </span>
                  <Link href={`/service-menu/edit/${s.id}`} style={{ textDecoration: "none" }}>
                    <button style={{ background: "none", border: "none", fontSize: 11, color: "var(--brown)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      <Edit2 size={12} /> EDIT
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pageCount > 0 && (
          <div style={{ marginTop: 24, background: "white", border: "1px solid var(--sand)", borderRadius: 12, overflow: "hidden" }}>
            <Pagination
              current={page}
              total={pageCount}
              perPage={perPage}
              onPageChange={(newPage) => setPage(newPage)}
              onPerPageChange={(newSize) => { setPerPage(newSize); setPage(1); }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
