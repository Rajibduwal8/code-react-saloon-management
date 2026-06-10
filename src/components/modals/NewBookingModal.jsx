import React, { useEffect, useState } from "react";
import { X, UserPlus, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import AddCustomerModal from "./AddCustomerModal";
import CustomerService from "../../services/OrderingServices/CustomerService";
import ProductService from "../../services/OrderingServices/ProductService";
import AppointmentService from "../../services/OrderingServices/AppointmentService";
import { toApiDateTime } from "../../utils/appointmentUtils";

const emptyItem = () => ({
  productId: "",
  quantity: 1,
  unitPrice: 0,
  remarks: "",
});

export default function NewBookingModal({ onClose, onSuccess }) {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
    remarks: "",
    items: [emptyItem()],
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const loadRefs = async () => {
    try {
      setLoading(true);
      const [custRes, prodRes] = await Promise.all([
        CustomerService.getList({ Page: 1, PageSize: 500, IsActive: true }),
        ProductService.getList({ Page: 1, PageSize: 500, FetchHidden: false }),
      ]);
      setCustomers(custRes?.items || []);
      setProducts(prodRes?.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customers or products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRefs();
  }, []);

  const selectedCustomer = customers.find(
    (c) => String(c.id) === String(form.customerId),
  );

  const updateItem = (index, field, value) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) => {
        if (i !== index) return item;
        const next = { ...item, [field]: value };
        if (field === "productId") {
          const product = products.find((p) => String(p.id) === String(value));
          next.unitPrice = product?.price ?? 0;
        }
        if (field === "quantity" || field === "unitPrice") {
          next[field] = Number(value) || 0;
        }
        return next;
      }),
    }));
  };

  const addRow = () =>
    setForm((f) => ({ ...f, items: [...f.items, emptyItem()] }));

  const removeRow = (index) =>
    setForm((f) => ({
      ...f,
      items:
        f.items.length > 1
          ? f.items.filter((_, i) => i !== index)
          : f.items,
    }));

  const grandTotal = form.items.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0,
  );

  const handleSubmit = async () => {
    if (!form.customerId) {
      toast.error("Please select a customer");
      return;
    }
    const validItems = form.items.filter((item) => item.productId);
    if (validItems.length === 0) {
      toast.error("Add at least one product or service");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        appointmentDateTime: toApiDateTime(form.date, form.time),
        customerId: Number(form.customerId),
        remarks: form.remarks || "",
        details: validItems.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.unitPrice) || 0,
          remarks: item.remarks || "",
        })),
      };
      await AppointmentService.create(payload);
      toast.success("Appointment created");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (showAddCustomer) {
    return (
      <AddCustomerModal
        onClose={() => setShowAddCustomer(false)}
        onSuccess={async () => {
          setShowAddCustomer(false);
          await loadRefs();
        }}
      />
    );
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: 2,
                }}
              >
                New Booking
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 600,
                  color: "var(--dark)",
                }}
              >
                Add New Appointment
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                marginTop: 2,
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          className="drawer-body"
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          {loading ? (
            <div style={{ textAlign: "center", color: "var(--muted)", padding: 20 }}>
              Loading...
            </div>
          ) : (
            <>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Customer
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomer(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--brown)",
                      fontSize: 11,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    <UserPlus size={12} /> + New Customer
                  </button>
                </div>
                <select
                  className="form-select"
                  value={form.customerId}
                  onChange={(e) => set("customerId", e.target.value)}
                >
                  <option value="">Select Customer.......</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {[c.firstName, c.lastName].filter(Boolean).join(" ") ||
                        c.email ||
                        `Customer #${c.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    value={selectedCustomer?.email || ""}
                    readOnly
                    placeholder="Auto show when customer selected"
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    value={selectedCustomer?.phoneNo || ""}
                    readOnly
                    placeholder="Auto show when customer selected"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Appointment Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Appointment Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={form.time}
                    onChange={(e) => set("time", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Remarks</label>
                <textarea
                  className="form-input"
                  style={{ resize: "none", height: 70 }}
                  placeholder="Enter any remarks......"
                  value={form.remarks}
                  onChange={(e) => set("remarks", e.target.value)}
                />
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Appointment Items
                  </label>
                  <button
                    type="button"
                    onClick={addRow}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--brown)",
                      fontSize: 11,
                      cursor: "pointer",
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Plus size={12} /> Add Row
                  </button>
                </div>
                <div
                  style={{
                    border: "1px solid #E0D8D0",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  {form.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "10px 12px",
                        borderBottom:
                          index < form.items.length - 1
                            ? "1px solid #E0D8D0"
                            : "none",
                        display: "grid",
                        gridTemplateColumns: "1fr 70px 90px 32px",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <select
                        className="form-select"
                        value={item.productId}
                        onChange={(e) =>
                          updateItem(index, "productId", e.target.value)
                        }
                      >
                        <option value="">Select Product or Service....</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        className="form-input"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                        placeholder="Qty"
                      />
                      <input
                        type="number"
                        className="form-input"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(index, "unitPrice", e.target.value)
                        }
                        placeholder="Rate"
                      />
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#E05C5C",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: "#FFF8F0",
                  border: "1px solid #F0E0C8",
                  borderRadius: 10,
                  padding: "14px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}
                >
                  GRAND TOTAL
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#4CAF50" }}>
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="drawer-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={submitting || loading}
          >
            {submitting ? "Creating..." : "Create Appointment"}
          </button>
        </div>
      </div>
    </>
  );
}
