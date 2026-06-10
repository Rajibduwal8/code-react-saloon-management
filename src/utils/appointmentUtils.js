export const formatAppointmentDateTime = (iso) => {
  if (!iso) return { date: "—", time: "—", full: "—" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "—", time: "—", full: "—" };
  return {
    date: d.toLocaleDateString(),
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    full: d.toLocaleString(),
  };
};

export const toApiDateTime = (date, time) => {
  if (!date) return new Date().toISOString();
  const timePart = time || "00:00";
  return new Date(`${date}T${timePart}`).toISOString();
};

export const formatPaymentStatus = (status) => {
  if (status === null || status === undefined || status === "") return "—";
  if (typeof status === "string") return status;
  const map = { 1: "Unpaid", 2: "Partial", 3: "Paid" };
  return map[status] || String(status);
};

export const getStatusColor = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "completed") return "#4CAF50";
  if (s === "cancelled") return "#E05C5C";
  if (s === "booked") return "#3B82F6";
  return "var(--muted)";
};

export const getPaymentColor = (status) => {
  const label = formatPaymentStatus(status).toLowerCase();
  if (label === "paid") return "#4CAF50";
  if (label === "unpaid") return "#E05C5C";
  return "var(--warm)";
};

export const startOfMonthIso = (date = new Date()) => {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  return d.toISOString();
};

export const endOfMonthIso = (date = new Date()) => {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return d.toISOString();
};

export const toDateInputValue = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

export const toTimeInputValue = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toTimeString().slice(0, 5);
};
