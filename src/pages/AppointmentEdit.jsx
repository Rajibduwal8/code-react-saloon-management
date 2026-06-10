import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import AppointmentService from "../services/OrderingServices/AppointmentService";
import CustomerService from "../services/OrderingServices/CustomerService";
import ProductService from "../services/OrderingServices/ProductService";
import {
  toApiDateTime,
  toDateInputValue,
  toTimeInputValue,
} from "../utils/appointmentUtils";

const emptyItem = () => ({
  productId: "",
  quantity: 1,
  unitPrice: 0,
  remarks: "",
});

export default function AppointmentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customerId: "",
    date: "",
    time: "",
    remarks: "",
    items: [emptyItem()],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [appt, custRes, prodRes] = await Promise.all([
          AppointmentService.getById(id),
          CustomerService.getList({ Page: 1, PageSize: 500, IsActive: true }),
          ProductService.getList({ Page: 1, PageSize: 500, FetchHidden: false }),
        ]);
        setCustomers(custRes?.items || []);
        setProducts(prodRes?.items || []);
        setForm({
          customerId: appt.customerId || "",
          date: toDateInputValue(appt.appointmentDateTime),
          time: toTimeInputValue(appt.appointmentDateTime),
          remarks: appt.remarks || "",
          items:
            appt.details?.length > 0
              ? appt.details.map((d) => ({
                  productId: d.productId,
                  quantity: d.quantity || 1,
                  unitPrice: d.unitPrice || 0,
                  remarks: d.remarks || "",
                }))
              : [emptyItem()],
        });
      } catch (error) {
        console.error("Error fetching appointment:", error);
        toast.error("Failed to load appointment");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const setField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const updateItem = (index, field, value) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) => {
        if (i !== index) return item;
        const next = { ...item, [field]: value };
        if (field === "productId") {
          const product = products.find((p) => String(p.id) === String(value));
          next.unitPrice = product?.price ?? item.unitPrice;
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validItems = form.items.filter((item) => item.productId);
    if (!form.customerId) {
      toast.error("Please select a customer");
      return;
    }
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
      await AppointmentService.update(id, payload);
      toast.success("Appointment updated");
      navigate(`/appointments/${id}`);
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="page-header">
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <button
            className="btn-outline"
            onClick={() => navigate(`/appointments/${id}`)}
          >
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <div className="page-title">Edit Appointment</div>
            <div className="page-subtitle">
              Update booking details for this appointment
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "16px 28px" }}>
        <div className="stat-card" style={{ padding: 24 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
          >
            <div>
              <label className="form-label">Customer</label>
              <select
                className="form-select"
                value={form.customerId}
                onChange={(e) => setField("customerId", e.target.value)}
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {[c.firstName, c.lastName].filter(Boolean).join(" ") ||
                      c.email ||
                      `Customer #${c.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Remarks</label>
              <input
                className="form-input"
                value={form.remarks}
                onChange={(e) => setField("remarks", e.target.value)}
                placeholder="Remarks"
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              marginTop: 16,
            }}
          >
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-input"
                value={form.time}
                onChange={(e) => setField("time", e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
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
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Plus size={13} /> Add Row
              </button>
            </div>
            <div
              style={{
                border: "1px solid var(--sand)",
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
                        ? "1px solid var(--sand)"
                        : "none",
                    display: "grid",
                    gridTemplateColumns: "1fr 70px 100px 1fr 32px",
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
                    <option value="">Select product</option>
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
                  />
                  <input
                    className="form-input"
                    value={item.remarks}
                    onChange={(e) =>
                      updateItem(index, "remarks", e.target.value)
                    }
                    placeholder="Remarks"
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
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 24,
            }}
          >
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(`/appointments/${id}`)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
