"use client";

import CourseDetail from "@/src/pages/CourseDetail";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  return <CourseDetail id={params.id} />;
}
