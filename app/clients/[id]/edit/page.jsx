"use client";

import ClientEdit from "@/src/pages/ClientEdit";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return <ClientEdit id={params.id} />;
}
