"use client";

import AppointmentEdit from "@/src/pages/AppointmentEdit";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return <AppointmentEdit id={params.id} />;
}
