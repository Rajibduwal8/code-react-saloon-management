"use client";

import StudentEdit from "@/src/pages/StudentEdit";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return <StudentEdit id={params.id} />;
}
