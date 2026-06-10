import React, { useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import AppointmentService from "../../services/OrderingServices/AppointmentService";
import ProductService from "../../services/OrderingServices/ProductService";
import PaymentTypeService from "../../services/OrderingServices/PaymentTypeService";
import { formatAppointmentDateTime } from "../../utils/appointmentUtils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";

export default function AppointmentCheckoutPanel({
  appointmentId,
  onComplete,
  onCancel,
  cancelLabel = "Cancel",
}) {
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

  useEffect(() => {
    if (!appointmentId) return;
    const load = async () => {
      try {
        setLoading(true);
        setAdditionalItems([]);
        setOriginalItemsEdited({});
        setSelectedPayments([]);
        setPaymentAmounts({});
        setDiscountAmount(0);
        setDiscountPercentage(0);
        setTaxAmount(0);
        setPanNumber("");

        const [data, prodRes, pts] = await Promise.all([
          AppointmentService.getById(appointmentId),
          ProductService.getList({ Page: 1, PageSize: 500, FetchHidden: false }),
          PaymentTypeService.getList(),
        ]);
        setAppointment(data);
        setProductOptions(prodRes?.items || []);
        const types = Array.isArray(pts) ? pts : pts?.items || [];
        setPaymentTypes(
          types.filter((pt) => pt.isActive !== false && pt.IsActive !== false),
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load appointment billing");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [appointmentId]);

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
      await AppointmentService.complete(Number(appointmentId), payload);
      toast.success("Appointment completed and payment recorded");
      onComplete?.(appointmentId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete appointment");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-12 text-center text-sm text-stone-500">
        Loading billing details...
      </Card>
    );
  }

  if (!appointment) {
    return (
      <Card className="p-12 text-center text-sm text-stone-500">
        Appointment not found
      </Card>
    );
  }

  const returnAmount = paymentsTotal > total ? paymentsTotal - total : 0;
  const { full } = formatAppointmentDateTime(appointment.appointmentDateTime);

  const SummaryRow = ({ label, children, className }) => (
    <div className={cn("flex items-center justify-between gap-2 mb-2 text-sm", className)}>
      <span>{label}</span>
      {children}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px] items-start">
      <Card className="overflow-hidden">
        <CardHeader className="flex-row flex-wrap items-start justify-between gap-3 space-y-0">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">
              APPOINTMENTS &gt; CHECKOUT #{appointment.id}
            </p>
            <CardTitle>Appointment Checkout</CardTitle>
          </div>
          <div className="flex flex-col items-end gap-1 text-xs">
            <span className="text-[10px] uppercase text-stone-500">Customer</span>
            <strong className="text-brand-dark">{appointment.customerName || "—"}</strong>
            <Badge variant="default">
              {invoiceItems.length} Item{invoiceItems.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Detail</th>
                <th>Qty</th>
                <th style={{ textAlign: "right" }}>Rate</th>
                <th style={{ textAlign: "right" }}>Total</th>
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
                        className="flex h-9 w-full rounded-lg border border-[#E0D8D0] bg-white px-3 text-sm"
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
                    <Input
                      type="number"
                      className="w-[70px]"
                      min="1"
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
                  <td className="text-right">
                    <Input
                      type="number"
                      className="w-[100px] text-right ml-auto"
                      min="0"
                      step="0.01"
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
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span>
                        {(
                          (Number(it.quantity) || 0) * (Number(it.rate) || 0)
                        ).toFixed(2)}
                      </span>
                      {!it.isOriginal && (
                        <button
                          type="button"
                          onClick={() => removeItem(it.additionalIdx)}
                          className="text-red-500 hover:text-red-600"
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
          <Button type="button" variant="link" onClick={addItem} className="mt-2.5 px-0 text-brand-brown">
            <Plus size={13} /> Add Custom Item
          </Button>
        </CardContent>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-brand-sand p-4">
          <div>
            <h4 className="text-sm font-bold mb-2.5">Payment Mode</h4>
            <div className="flex flex-wrap gap-2">
              {paymentTypes.map((pt) => {
                const isSelected = selectedPayments.some((p) => p.id === pt.id);
                return (
                  <Button
                    key={pt.id}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSelectPaymentType(pt)}
                  >
                    {pt.name || pt.Name || pt.title}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="text-sm">
            <SummaryRow label="Sub Total (Rs)">
              <strong className="text-green-600">{subtotal.toFixed(2)}</strong>
            </SummaryRow>
            <SummaryRow label="Discount">
              <div className="flex gap-2 max-w-[200px]">
                <Input
                  type="number"
                  placeholder="%"
                  value={discountPercentage}
                  onChange={(e) => handleDiscountPercentageChange(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Rs"
                  value={discountAmount}
                  onChange={(e) => handleDiscountAmountChange(e.target.value)}
                />
              </div>
            </SummaryRow>
            <SummaryRow label="Tax (Rs)">
              <Input
                type="number"
                className="w-[120px] text-right"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
              />
            </SummaryRow>
            <SummaryRow label="Total Amount (Rs)">
              <strong className="text-green-600">{total.toFixed(2)}</strong>
            </SummaryRow>
            {selectedPayments.map((item) => (
              <SummaryRow key={item.id} label={item.name || item.Name || item.title}>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeSelectedPayment(item.id)}
                  >
                    <X size={12} />
                  </Button>
                  <Input
                    className="w-[100px] text-right"
                    value={paymentAmounts[item.id] ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        updatePaymentAmount(item.id, value);
                      }
                    }}
                  />
                </div>
              </SummaryRow>
            ))}
            <SummaryRow label="Return Amount (Rs)" className="text-red-500 font-bold">
              <strong>{returnAmount.toFixed(2)}</strong>
            </SummaryRow>
          </div>
        </div>
      </Card>

      <Card className="p-5 sticky top-20">
        <div className="text-center mb-4">
          <div className="font-serif text-sm font-bold tracking-wide">ASMEE OUTLET</div>
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">
            Provisional Invoice
          </div>
        </div>
        <div className="text-[11px] text-stone-500 mb-3 leading-relaxed space-y-0.5">
          <div>Appt No.: #{appointment.id}</div>
          <div>Customer: {appointment.customerName || "—"}</div>
          <div>Date: {full}</div>
        </div>
        <table className="data-table w-full text-[11px]">
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
        <div className="border-t border-brand-sand mt-3 pt-3 text-xs space-y-1">
          <SummaryRow label="Sub Total"><span>Rs. {subtotal.toFixed(2)}</span></SummaryRow>
          {discountVal() > 0 && (
            <SummaryRow label="Discount">
              <span>- Rs. {discountVal().toFixed(2)}</span>
            </SummaryRow>
          )}
          {Number(taxAmount) > 0 && (
            <SummaryRow label="Tax">
              <span>Rs. {Number(taxAmount).toFixed(2)}</span>
            </SummaryRow>
          )}
          <SummaryRow label="Net Amount" className="font-bold">
            <span>Rs. {total.toFixed(2)}</span>
          </SummaryRow>
        </div>
        <div className="flex justify-between gap-2.5 mt-5 pt-4 border-t border-brand-sand">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          <Button
            type="button"
            disabled={sending || !(selectedPayments.length > 0 && paymentsTotal >= total)}
            onClick={handleSubmit}
            className="ml-auto"
          >
            {sending ? "Processing..." : "Complete & Pay"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
