"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2Icon } from "lucide-react";
import { getCourseById, deleteCourse } from "../services/courseService";

export default function CourseDetail({ id }) {
  const router = useRouter();
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
        <div className="stat-card" style={{ padding: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
              marginBottom: 28,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Course Overview
              </div>
              <div
                style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.7 }}
              >
                {course.description}
              </div>
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              {[
                { label: "Instructor", value: course.instructor },
                { label: "Duration", value: `${course.duration} hrs` },
                { label: "Level", value: course.level },
                { label: "Students Enrolled", value: course.students ?? 0 },
                {
                  label: "Price",
                  value: course.price ? `NPR ${course.price}` : "—",
                },
                { label: "Status", value: course.status },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                    }}
                  >
                    {item.value || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#4CAF50",
                background: "#F1F9F5",
                borderRadius: 999,
                padding: "6px 12px",
              }}
            >
              {course.category || "General"}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#8B5E3C",
                background: "#FDF5EA",
                borderRadius: 999,
                padding: "6px 12px",
              }}
            >
              {course.level}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
