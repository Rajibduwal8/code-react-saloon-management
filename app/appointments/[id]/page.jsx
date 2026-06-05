"use client";

import AppointmentDetail from "@/src/pages/AppointmentDetail";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return <AppointmentDetail id={params.id} />;
}
