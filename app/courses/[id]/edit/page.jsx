"use client";

import CourseEdit from "@/src/pages/CourseEdit";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return <CourseEdit id={params.id} />;
}
