"use client";

import StaffEdit from "@/src/pages/StaffEdit";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return <StaffEdit id={params.id} />;
}
