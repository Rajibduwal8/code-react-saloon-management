import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import AppointmentService from "../services/OrderingServices/AppointmentService";
import ProductService from "../services/OrderingServices/ProductService";
import PaymentTypeService from "../services/OrderingServices/PaymentTypeService";
import { formatAppointmentDateTime } from "../utils/appointmentUtils";

export default function AppointmentComplete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [additionalItems, setAdditionalItems] = useState([]);
  const [originalItemsEdited, setOriginalItemsEdited] = useState({});
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [paymentAmounts, setPaymentAmounts] = useState({});
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [panNumber, setPanNumber] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);

  const handleDiscountPercentageChange = (v) => {
    const pct = Number(v) || 0;
    setDiscountPercentage(pct);
    setDiscountAmount(Number(((subtotal * pct) / 100).toFixed(2)));
  };

  const handleDiscountAmountChange = (v) => {
    const amt = Number(v) || 0;
    setDiscountAmount(amt);
    setDiscountPercentage(subtotal ? Number(((amt / subtotal) * 100).toFixed(2)) : 0);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [data, prodRes, pts] = await Promise.all([
          AppointmentService.getById(id),
          ProductService.getList({ Page: 1, PageSize: 500, FetchHidden: false }),
          PaymentTypeService.getList(),
        ]);
        setAppointment(data);
        const raw = prodRes?.items || [];
        setProductOptions(raw);
        const types = Array.isArray(pts) ? pts : pts?.items || [];
        setPaymentTypes(types.filter((pt) => pt.isActive !== false && pt.IsActive !== false));
        setAdditionalItems([]);
        setOriginalItemsEdited({});
      } catch (err) {
        console.error(err);
        toast.error("Failed to load appointment");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const invoiceItems = useMemo(() => {
    const base = (appointment?.details || []).map((d, idx) => {
      const edited = originalItemsEdited[idx] || {};
      return {
        productId: d.productId,
        description: d.productName || `Product #${d.productId}`,
        quantity:
          edited.quantity !== undefined
            ? edited.quantity
            : Number(d.quantity) || 1,
        rate:
          edited.rate !== undefined ? edited.rate : Number(d.unitPrice) || 0,
        isOriginal: true,
        originalIdx: idx,
      };
    });
    return base.concat(
      (additionalItems || []).map((item, i) => ({ ...item, additionalIdx: i })),
    );
  }, [appointment, additionalItems, originalItemsEdited]);

  const subtotal = useMemo(
    () =>
      invoiceItems.reduce(
        (s, it) => s + (Number(it.quantity) || 0) * (Number(it.rate) || 0),
        0,
      ),
    [invoiceItems],
  );

  const discountVal = () => {
    if (Number(discountPercentage))
      return (subtotal * Number(discountPercentage)) / 100;
    return Number(discountAmount) || 0;
  };

  const total = useMemo(
    () => Math.max(0, subtotal - discountVal() + Number(taxAmount || 0)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subtotal, discountAmount, discountPercentage, taxAmount],
  );

  const paymentsTotal = useMemo(
    () =>
      (selectedPayments || []).reduce((s, p) => {
        const amt = Number(paymentAmounts[p.id] || 0);
        return s + (isNaN(amt) ? 0 : amt);
      }, 0),
    [selectedPayments, paymentAmounts],
  );

  const addItem = () =>
    setAdditionalItems((s) => [
      ...s,
      { productId: "", description: "", quantity: 1, rate: 0 },
    ]);

  const updateOriginalItem = (originalIdx, field, value) => {
    setOriginalItemsEdited((prev) => ({
      ...prev,
      [originalIdx]: {
        ...prev[originalIdx],
        [field]:
          field === "quantity" || field === "rate" ? Number(value) || 0 : value,
      },
    }));
  };

  const updateItem = (i, field, value) =>
    setAdditionalItems((s) =>
      s.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)),
    );

  const removeItem = (i) =>
    setAdditionalItems((s) => s.filter((_, idx) => idx !== i));

  const toggleSelectPaymentType = (pt) => {
    setSelectedPayments((prev) => {
      const exists = prev.some((p) => p.id === pt.id);
      if (exists) {
        setPaymentAmounts((amtPrev) => {
          const { [pt.id]: _, ...rest } = amtPrev;
          return rest;
        });
        return prev.filter((p) => p.id !== pt.id);
      }
      setPaymentAmounts((amtPrev) => ({
        ...amtPrev,
        [pt.id]:
          Number(
            (
              total -
              Object.values(amtPrev).reduce((s, a) => s + Number(a || 0), 0)
            ).toFixed(2),
          ) || 0,
      }));
      return [...prev, pt];
    });
  };

  const updatePaymentAmount = (paymentId, value) => {
    setPaymentAmounts((prev) => ({ ...prev, [paymentId]: value }));
  };

  const removeSelectedPayment = (paymentId) => {
    setSelectedPayments((prev) => prev.filter((p) => p.id !== paymentId));
    setPaymentAmounts((prev) => {
      const { [paymentId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async () => {
    try {
      setSending(true);
      const billingItems = invoiceItems.map((it) => ({
        productId: Number(it.productId) || null,
        unitId: null,
        quantity: Number(it.quantity) || 1,
        rate: Number(it.rate) || 0,
        remarks: it.description || "",
      }));

      const payload = {
        remarks: "Completed",
        panNumber: panNumber || "",
        discountAmount: Number(discountAmount) || 0,
        discountPercentage: Number(discountPercentage) || 0,
        taxAmount: Number(taxAmount) || 0,
        payments: (selectedPayments || []).map((p) => ({
          paymentTypeId: Number(p.id) || null,
          amount: Number(paymentAmounts[p.id]) || 0,
        })),
        additionalBillingItems: billingItems,
      };
      await AppointmentService.complete(Number(id), payload);
      toast.success("Appointment completed and payment recorded");
      navigate(`/appointments/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete appointment");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px 28px", textAlign: "center", color: "var(--muted)" }}>
        Loading...
      </div>
    );
  }

  if (!appointment) {
    return (
      <div style={{ padding: "40px 28px" }}>
        <button className="btn-outline" onClick={() => navigate("/appointments")}>
          <ArrowLeft size={13} /> Back
        </button>
        <div style={{ marginTop: 20, color: "var(--muted)" }}>
          Appointment not found
        </div>
      </div>
    );
  }

  const returnAmount = paymentsTotal > total ? paymentsTotal - total : 0;
  const { full } = formatAppointmentDateTime(appointment.appointmentDateTime);

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="btn-outline"
            onClick={() => navigate(`/appointments/${id}`)}
          >
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <div className="page-title">
              Complete Appointment #{appointment.id}
            </div>
            <div className="page-subtitle">
              {appointment.customerName} • {full}
            </div>
          </div>
        </div>
      </div>

      <div className="page-body grid-2-1-layout" style={{ paddingTop: 16, paddingBottom: 16 }}>
        {/* Left: items + payment */}
        <div
          style={{
            background: "white",
            border: "1px solid var(--sand)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--sand)",
              background: "#FDFAF8",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
              Appointment Items
            </h3>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              {invoiceItems.length} item{invoiceItems.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div style={{ padding: 16, overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th style={{ textAlign: "right" }}>Rate (Rs)</th>
                  <th style={{ textAlign: "right" }}>Total (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((it, idx) => (
                  <tr
                    key={idx}
                    style={!it.isOriginal ? { background: "#FFFBEB" } : undefined}
                  >
                    <td>{idx + 1}</td>
                    <td>
                      {it.isOriginal ? (
                        <span style={{ fontWeight: 600 }}>{it.description}</span>
                      ) : (
                        <select
                          className="form-select"
                          value={it.productId || ""}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const product = productOptions.find(
                              (p) => String(p.id) === String(selectedId),
                            );
                            updateItem(it.additionalIdx, "productId", selectedId);
                            updateItem(
                              it.additionalIdx,
                              "description",
                              product?.name || "",
                            );
                            updateItem(
                              it.additionalIdx,
                              "rate",
                              product?.price || 0,
                            );
                          }}
                        >
                          <option value="">Select product</option>
                          {productOptions.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input"
                        min="1"
                        style={{ width: 70 }}
                        value={it.quantity}
                        onChange={(e) =>
                          it.isOriginal
                            ? updateOriginalItem(
                                it.originalIdx,
                                "quantity",
                                e.target.value,
                              )
                            : updateItem(
                                it.additionalIdx,
                                "quantity",
                                e.target.value,
                              )
                        }
                      />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <input
                        type="number"
                        className="form-input"
                        min="0"
                        step="0.01"
                        style={{ width: 100, textAlign: "right" }}
                        value={it.rate}
                        onChange={(e) =>
                          it.isOriginal
                            ? updateOriginalItem(
                                it.originalIdx,
                                "rate",
                                e.target.value,
                              )
                            : updateItem(it.additionalIdx, "rate", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 8,
                        }}
                      >
                        <span>
                          {(
                            (Number(it.quantity) || 0) * (Number(it.rate) || 0)
                          ).toFixed(2)}
                        </span>
                        {!it.isOriginal && (
                          <button
                            type="button"
                            onClick={() => removeItem(it.additionalIdx)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#E05C5C",
                            }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              onClick={addItem}
              style={{
                background: "none",
                border: "none",
                color: "var(--brown)",
                fontSize: 12,
                cursor: "pointer",
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Plus size={13} /> Add item
            </button>
          </div>

          <div
            style={{
              padding: 16,
              borderTop: "1px solid var(--sand)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                Payment Mode
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {paymentTypes.map((pt) => {
                  const isSelected = selectedPayments.some((p) => p.id === pt.id);
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      className={isSelected ? "btn-primary" : "btn-outline"}
                      style={{ fontSize: 12, padding: "6px 12px" }}
                      onClick={() => toggleSelectPaymentType(pt)}
                    >
                      {pt.name || pt.Name || pt.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ fontSize: 13 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span>Sub Total</span>
                <strong>Rs. {subtotal.toFixed(2)}</strong>
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="form-label">Discount</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="%"
                    value={discountPercentage}
                    onChange={(e) =>
                      handleDiscountPercentageChange(e.target.value)
                    }
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Rs"
                    value={discountAmount}
                    onChange={(e) => handleDiscountAmountChange(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="form-label">Tax (Rs)</label>
                <input
                  type="number"
                  className="form-input"
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="form-label">PAN Number</label>
                <input
                  className="form-input"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                />
              </div>
              {selectedPayments.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {item.name || item.Name || item.title}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      className="btn-outline"
                      style={{ padding: "2px 8px" }}
                      onClick={() => removeSelectedPayment(item.id)}
                    >
                      <X size={12} />
                    </button>
                    <input
                      className="form-input"
                      style={{ width: 100, textAlign: "right" }}
                      value={paymentAmounts[item.id] ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          updatePaymentAmount(item.id, value);
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  marginTop: 8,
                }}
              >
                <span>Total</span>
                <span style={{ color: "#4CAF50" }}>Rs. {total.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#E05C5C",
                  marginTop: 4,
                }}
              >
                <span>Return Amount</span>
                <span>Rs. {returnAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: invoice preview */}
        <div
          style={{
            background: "white",
            border: "1px solid var(--sand)",
            borderRadius: 12,
            padding: 20,
            position: "sticky",
            top: 20,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {appointment.customerName}
            </div>
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted)",
                marginTop: 4,
              }}
            >
              Provisional Invoice
            </div>
          </div>

          <div style={{ fontSize: 12, marginBottom: 12, color: "var(--muted)" }}>
            <div>Appt No.: #{appointment.id}</div>
            <div>Date: {full}</div>
          </div>

          <table className="data-table" style={{ fontSize: 11 }}>
            <thead>
              <tr>
                <th>SN</th>
                <th>Item</th>
                <th>Qty</th>
                <th style={{ textAlign: "right" }}>Amnt</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((it, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{it.description}</td>
                  <td style={{ textAlign: "center" }}>{it.quantity}</td>
                  <td style={{ textAlign: "right" }}>
                    {(
                      (Number(it.quantity) || 0) * (Number(it.rate) || 0)
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              borderTop: "1px solid var(--sand)",
              marginTop: 12,
              paddingTop: 12,
              fontSize: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Sub Total</span>
              <span>Rs. {subtotal.toFixed(2)}</span>
            </div>
            {discountVal() > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Discount</span>
                <span>- Rs. {discountVal().toFixed(2)}</span>
              </div>
            )}
            {Number(taxAmount) > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Tax</span>
                <span>Rs. {Number(taxAmount).toFixed(2)}</span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                marginTop: 6,
              }}
            >
              <span>Net Amount</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid var(--sand)",
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(`/appointments/${id}`)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-submit"
              disabled={
                sending || !(selectedPayments.length > 0 && paymentsTotal >= total)
              }
              onClick={handleSubmit}
            >
              {sending ? "Processing..." : "Complete & Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
