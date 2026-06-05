"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2Icon } from "lucide-react";
import { getCourseById, deleteCourse } from "@/src/services/courseService";

export default function Page({ params }) {
  const router = useRouter();
  const { id } = params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id);
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Delete this course?")) {
      try {
        await deleteCourse(id);
        router.push("/courses");
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ padding: "40px 28px" }}>
        <button
          className="btn-outline"
          onClick={() => router.push("/courses")}
          style={{ marginBottom: 20 }}
        >
          <ArrowLeft size={13} /> Back to Courses
        </button>
        <div style={{ textAlign: "center", color: "var(--muted)" }}>
          Course not found
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="btn-outline"
              onClick={() => router.push("/courses")}
            >
              <ArrowLeft size={13} /> Back
            </button>
            <div>
              <div className="page-title">{course.name}</div>
              <div className="page-subtitle">
                Course Code: {course.code || course.id}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn-outline"
              onClick={() => router.push(`/courses/${id}/edit`)}
            >
              <Edit size={14} /> Edit
            </button>
            <button className="btn-cancel" onClick={handleDelete}>
              <Trash2Icon size={14} /> Delete
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 28px" }}>
        <div
          style={{
            background: "white",
            border: "1px solid var(--sand)",
            borderRadius: 12,
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Course Information
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Name
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {course.name}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Code
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {course.code}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Instructor
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {course.instructor}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Course Details
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Duration
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {course.duration}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Price
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    ${course.price || 0}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {course.status || "ACTIVE"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
