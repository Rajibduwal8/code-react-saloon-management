import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppointmentCheckoutPanel from "../components/billing/AppointmentCheckoutPanel";
import { Button } from "../components/ui/button";

export default function AppointmentComplete() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button
            variant="outline"
            onClick={() => navigate(`/appointments/${id}`)}
          >
            <ArrowLeft size={13} /> Back
          </Button>
          <div>
            <div className="page-title">Complete Appointment #{id}</div>
            <div className="page-subtitle">
              Review items, apply discounts, and record payment
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-7 py-4">
        <AppointmentCheckoutPanel
          appointmentId={id}
          onComplete={() => navigate(`/appointments/${id}`)}
          onCancel={() => navigate(`/appointments/${id}`)}
        />
      </div>
    </div>
  );
}
