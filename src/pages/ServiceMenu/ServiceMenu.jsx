import React, { useEffect, useState } from "react";
import { Search, Plus, ShoppingBag, Eye, EyeOff } from "lucide-react";
import ProductService from "../../services/OrderingServices/ProductService";
import ProductForm from "./component/ProductForm";
import DeleteModal from "../../components/common/DeleteModal";
import toast from "react-hot-toast";

export default function ServiceMenu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const [search, setSearch] = useState("");

  // Server-side pagination
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);
  const totalPages = Math.ceil(totalRows / perPage);

  // Summary stats
  const [stats, setStats] = useState({ total: 0, visible: 0, hidden: 0 });

  const fetchStats = async () => {
    try {
      const [allRes, visibleRes] = await Promise.all([
        ProductService.getList({ Page: 1, PageSize: 1, FetchHidden: true }),
        ProductService.getList({ Page: 1, PageSize: 1, FetchHidden: false }),
      ]);
      const total = allRes?.totalCount || 0;
      const visible = visibleRes?.totalCount || 0;
      setStats({ total, visible, hidden: total - visible });
    } catch (err) {
      console.error("Stats fetch failed", err);
    }
  };

  const fetchProducts = async (page = currentPage, name = search) => {
    try {
      setLoading(true);
      const params = {
        Page: page,
        PageSize: perPage,
        FetchHidden: true,
      };
      if (name) params.Name = name;

      const res = await ProductService.getList(params);
      setProducts(res?.items || []);
      setTotalRows(res?.totalCount || 0);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProducts(currentPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1, search);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleAdd = () => {
    setSelectedItem(null);
    setAddModal(true);
  };
  const handleEdit = (item) => {
    setSelectedItem(item);
    setAddModal(true);
  };
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await ProductService.delete(selectedItem.id);
      toast.success("Product deleted");
      fetchProducts(currentPage, search);
      fetchStats();
      setDeleteModal(false);
      setSelectedItem(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleSuccess = () => {
    fetchProducts(currentPage, search);
    fetchStats();
  };

  return (
    <div style={{ padding: "0 0 32px" }}>
      {/* Page Header */}
      <div className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div className="page-title">Treatment &amp; Product Menu</div>
            <div className="page-subtitle">
              Curate luxury formulations, products, pricing, session parameters,
              and categories.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div className="search-bar">
              <Search size={13} color="var(--muted)" />
              <input
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn-primary" onClick={handleAdd}>
              <Plus size={13} /> Add Services
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div
        style={{
          padding: "0 28px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Total */}
        <div
          style={{
            background: "white",
            border: "1px solid var(--sand)",
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              background: "#EBF4FF",
              borderRadius: 10,
              padding: 10,
              color: "#3B82F6",
              display: "flex",
            }}
          >
            <ShoppingBag size={20} />
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 700,
              }}
            >
              Total Products
            </div>
            <div
              style={{ fontSize: 24, fontWeight: 700, color: "var(--dark)" }}
            >
              {stats.total}
            </div>
          </div>
        </div>
        {/* Visible */}
        <div
          style={{
            background: "white",
            border: "1px solid var(--sand)",
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              background: "#ECFDF5",
              borderRadius: 10,
              padding: 10,
              color: "#10B981",
              display: "flex",
            }}
          >
            <Eye size={20} />
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 700,
              }}
            >
              Active / Visible
            </div>
            <div
              style={{ fontSize: 24, fontWeight: 700, color: "var(--dark)" }}
            >
              {stats.visible}
            </div>
          </div>
        </div>
        {/* Hidden */}
        <div
          style={{
            background: "white",
            border: "1px solid var(--sand)",
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              background: "#FEF9C3",
              borderRadius: 10,
              padding: 10,
              color: "#CA8A04",
              display: "flex",
            }}
          >
            <EyeOff size={20} />
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 700,
              }}
            >
              Hidden
            </div>
            <div
              style={{ fontSize: 24, fontWeight: 700, color: "var(--dark)" }}
            >
              {stats.hidden}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "0 28px",
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--muted)" }}>
          Showing {(currentPage - 1) * perPage + 1}–
          {Math.min(currentPage * perPage, totalRows)} of {totalRows}
        </span>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div
          style={{
            padding: "40px 28px",
            textAlign: "center",
            color: "var(--muted)",
            fontSize: 14,
          }}
        >
          Loading...
        </div>
      ) : products.length === 0 ? (
        <div
          style={{
            padding: "40px 28px",
            textAlign: "center",
            color: "var(--muted)",
            fontSize: 14,
          }}
        >
          No products found
        </div>
      ) : (
        <div
          style={{
            padding: "0 28px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {products.map((s) => (
            <div
              key={s.id}
              className="service-card"
              style={{ position: "relative" }}
            >
              {/* Top: unit badge + price */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    background: "var(--sand)",
                    color: "var(--brown)",
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 4,
                    padding: "3px 8px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {s.unitCode
                    ? s.unitCode.toUpperCase()
                    : s.categoryName || "—"}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--dark)",
                  }}
                >
                  Rs. {s.price?.toLocaleString()}
                </span>
              </div>

              {/* Name */}
              <div
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--dark)",
                  marginBottom: 4,
                }}
              >
                {s.name}
              </div>

              {/* Category */}
              <div
                style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}
              >
                {s.categoryName || "Uncategorized"}
              </div>

              {/* Tags */}
              <div
                style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}
              >
                {s.tags ? `Tags: ${s.tags}` : ""}
              </div>

              {/* Code */}
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  marginBottom: 14,
                }}
              >
                {s.code ? `Code: ${s.code}` : ""}
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid var(--sand)",
                  paddingTop: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: s.isProductSoldOut
                      ? "#E05C5C"
                      : s.isHidden
                        ? "#aaa"
                        : "#4CAF50",
                  }}
                >
                  •{" "}
                  {s.isProductSoldOut
                    ? "SOLD OUT"
                    : s.isHidden
                      ? "HIDDEN"
                      : "ACTIVE"}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 11,
                      color: "var(--brown)",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                    onClick={() => handleEdit(s)}
                  >
                    EDIT
                  </button>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 11,
                      color: "#E05C5C",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                    onClick={() => handleDeleteClick(s)}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            padding: "24px 28px 0",
          }}
        >
          <button
            className="btn-outline"
            style={{
              padding: "4px 14px",
              fontSize: 12,
              opacity: currentPage === 1 ? 0.4 : 1,
            }}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            «
          </button>
          <button
            className="btn-outline"
            style={{
              padding: "4px 14px",
              fontSize: 12,
              opacity: currentPage === 1 ? 0.4 : 1,
            }}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let page;
            if (totalPages <= 5) page = i + 1;
            else if (currentPage <= 3) page = i + 1;
            else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
            else page = currentPage - 2 + i;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: "4px 10px",
                  fontSize: 12,
                  border: `1px solid ${currentPage === page ? "var(--warm)" : "var(--sand)"}`,
                  borderRadius: 6,
                  background: currentPage === page ? "var(--warm)" : "white",
                  color: currentPage === page ? "white" : "var(--dark)",
                  cursor: "pointer",
                  fontWeight: currentPage === page ? 700 : 400,
                  minWidth: 32,
                }}
              >
                {page}
              </button>
            );
          })}

          <button
            className="btn-outline"
            style={{
              padding: "4px 14px",
              fontSize: 12,
              opacity: currentPage === totalPages ? 0.4 : 1,
            }}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
          <button
            className="btn-outline"
            style={{
              padding: "4px 14px",
              fontSize: 12,
              opacity: currentPage === totalPages ? 0.4 : 1,
            }}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            »
          </button>
        </div>
      )}

      <ProductForm
        modal={addModal}
        toggleModal={() => {
          setAddModal(false);
          setSelectedItem(null);
        }}
        selectedItem={selectedItem}
        fetchList={handleSuccess}
      />

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
    </div>
  );
}
