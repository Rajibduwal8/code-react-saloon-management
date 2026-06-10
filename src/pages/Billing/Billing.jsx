import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Receipt, User } from "lucide-react";
import toast from "react-hot-toast";
import AppointmentService from "../../services/OrderingServices/AppointmentService";
import AppointmentCheckoutPanel from "../../components/billing/AppointmentCheckoutPanel";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";
import {
  appointmentItemTotal,
  formatAppointmentDateTime,
  getStatusColor,
  startOfMonthIso,
  endOfMonthIso,
  toDateInputValue,
  toDateTimeRangeIso,
} from "../../utils/appointmentUtils";

export default function Billing() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [fromDate, setFromDate] = useState(toDateInputValue(startOfMonthIso()));
  const [toDate, setToDate] = useState(toDateInputValue(endOfMonthIso()));
  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime] = useState("23:59");

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const { from, to } = toDateTimeRangeIso(fromDate, fromTime, toDate, toTime);
      const data = await AppointmentService.getList({ from, to });
      const list = Array.isArray(data) ? data : data?.items || [];
      setAppointments(list);
      return list;
    } catch (error) {
      console.error(error);
      toast.error("Failed to load appointments");
      return [];
    } finally {
      setLoading(false);
    }
  }, [fromDate, fromTime, toDate, toTime]);

  useEffect(() => {
    fetchAppointments().then((list) => {
      if (selectedId && list && !list.some((a) => String(a.id) === String(selectedId))) {
        setSelectedId(null);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAppointments]);

  useEffect(() => {
    setSelectedId(null);
  }, [fromDate, fromTime, toDate, toTime]);

  const pendingAppointments = useMemo(
    () => appointments.filter((a) => String(a.status || "").toLowerCase() === "booked"),
    [appointments],
  );

  const handleComplete = () => {
    setSelectedId(null);
    fetchAppointments();
  };

  return (
    <div className="pb-8">
      <div className="page-header">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="page-title">Point of Sale &amp; Checkout</div>
            <div className="page-subtitle">
              Settle appointment invoices and issue digital receipts instantly.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-brand-sand bg-white px-2.5 py-1.5 text-xs">
            <Calendar size={13} className="text-stone-400 shrink-0" />
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-7 w-auto border-0 p-0 text-xs shadow-none focus-visible:ring-0"
            />
            <Input
              type="time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="h-7 w-auto border-0 p-0 text-xs shadow-none focus-visible:ring-0"
            />
            <span className="text-stone-400 text-[11px]">to</span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-7 w-auto border-0 p-0 text-xs shadow-none focus-visible:ring-0"
            />
            <Input
              type="time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className="h-7 w-auto border-0 p-0 text-xs shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 md:px-7 lg:grid-cols-[300px_1fr] pt-2">
        <Card className="flex flex-col overflow-hidden max-h-none lg:max-h-[calc(100vh-180px)]">
          <CardHeader className="flex-row items-center justify-between space-y-0 py-3.5">
            <CardTitle className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
              Pending Settlements
            </CardTitle>
            <Badge>{pendingAppointments.length}</Badge>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {loading ? (
              <p className="py-6 text-center text-sm text-stone-500">Loading appointments...</p>
            ) : pendingAppointments.length === 0 ? (
              <p className="py-6 text-center text-sm text-stone-500">
                No booked appointments in this date range.
              </p>
            ) : (
              pendingAppointments.map((appt) => {
                const { time } = formatAppointmentDateTime(appt.appointmentDateTime);
                const due = appointmentItemTotal(appt);
                const isActive = String(selectedId) === String(appt.id);
                const serviceCount = appt.details?.length || 0;

                return (
                  <button
                    key={appt.id}
                    type="button"
                    onClick={() => setSelectedId(appt.id)}
                    className={cn(
                      "flex w-full gap-2.5 rounded-lg border p-3 text-left transition-all font-sans",
                      isActive
                        ? "border-brand-brown bg-[#FFF8F0] shadow-sm"
                        : "border-brand-sand bg-white hover:border-brand-warm hover:bg-[#FDFAF8]",
                    )}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-sand text-stone-500">
                      <User size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold uppercase tracking-wide text-brand-dark truncate">
                        {appt.customerName || "Client"}
                      </div>
                      <div className="mt-0.5 text-[10px] text-stone-500">
                        {time} • {serviceCount} SERVICE{serviceCount !== 1 ? "S" : ""}
                      </div>
                      <div className="mt-1 text-[11px] font-bold text-red-500">
                        Rs. {due.toLocaleString()} Due
                      </div>
                      <span
                        className="mt-1 block text-[9px] font-bold tracking-wider"
                        style={{ color: getStatusColor(appt.status) }}
                      >
                        {String(appt.status || "").toUpperCase()}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="min-w-0">
          {selectedId ? (
            <AppointmentCheckoutPanel
              appointmentId={selectedId}
              onComplete={handleComplete}
              onCancel={() => setSelectedId(null)}
              cancelLabel="Back to List"
            />
          ) : (
            <Card className="flex min-h-[480px] flex-col items-center justify-center p-10 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-brand-sand bg-[#FDFAF8] text-brand-warm">
                <Receipt size={40} />
              </div>
              <h3 className="font-serif text-xl text-brand-dark mb-2">Select an Appointment</h3>
              <p className="max-w-md text-sm text-stone-500 leading-relaxed">
                Choose a pending settlement from the left panel to view billing details,
                edit item prices, add extra items, and process payment.
              </p>
              <div className="mt-5 flex flex-col gap-1.5 text-xs text-brand-brown">
                <span>• Edit quantities and rates</span>
                <span>• Add custom billing items</span>
                <span>• Split payment across methods</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
