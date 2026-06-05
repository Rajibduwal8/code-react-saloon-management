"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Navigation handled by Next.js wrapper
// import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getCourseById, updateCourse } from "../services/courseService";

const CATEGORY_OPTIONS = [
  "Hair Esthetics & Design",
  "Nail Art & Design",
  "Skincare & Facial",
  "Massage Therapy",
];
const LEVEL_OPTIONS = [
  "Beginner Level",
  "Intermediate Level",
  "Advanced Level",
];
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "ARCHIVED"];

export default function CourseEdit({ id }) {
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id);
        setCourse(data);
        setForm({
          code: data?.code || "",
          title: data?.name || "",
          description: data?.description || "",
          duration: data?.duration || "",
          rate: data?.price?.toString() || "",
          instructor: data?.instructor || "",
          category: data?.category || CATEGORY_OPTIONS[0],
          level: data?.level || LEVEL_OPTIONS[0],
          status: data?.status || STATUS_OPTIONS[0],
        });
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const setField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateCourse(id, {
        code: form.code,
        name: form.title,
        description: form.description,
        duration: form.duration,
        price: Number(form.rate) || 0,
        instructor: form.instructor,
        category: form.category,
        level: form.level,
        status: form.status,
      });
      router.push(`/courses/${id}`);
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="page-header">
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <button
            className="btn-outline"
            onClick={() => router.push(`/courses/${id}`)}
          >
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <div className="page-title">Edit Course</div>
            <div className="page-subtitle">
              Update course information and pricing
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "16px 28px" }}>
        <div className="stat-card" style={{ padding: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            <div>
              <label className="form-label">Course Code</label>
              <input
                className="form-input"
                value={form.code}
                onChange={(e) => setField("code", e.target.value)}
                placeholder="e.g. CRS-BAL01"
              />
            </div>
            <div>
              <label className="form-label">Course Title</label>
              <input
                className="form-input"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Advanced Balayage Artistry"
              />
            </div>
            <div>
              <label className="form-label">Course Rate</label>
              <input
                className="form-input"
                value={form.rate}
                onChange={(e) => setField("rate", e.target.value)}
                placeholder="15000"
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              marginTop: 20,
            }}
          >
            <div>
              <label className="form-label">Duration</label>
              <input
                className="form-input"
                value={form.duration}
                onChange={(e) => setField("duration", e.target.value)}
                placeholder="45"
              />
            </div>
            <div>
              <label className="form-label">Instructor</label>
              <input
                className="form-input"
                value={form.instructor}
                onChange={(e) => setField("instructor", e.target.value)}
                placeholder="Instructor Name"
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginTop: 20,
            }}
          >
            <div>
              <label className="form-label">Category Group</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Level</label>
              <select
                className="form-select"
                value={form.level}
                onChange={(e) => setField("level", e.target.value)}
              >
                {LEVEL_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              style={{ minHeight: 110 }}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Course description"
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 24,
            }}
          >
            <button
              type="button"
              className="btn-cancel"
              onClick={() => router.push(`/courses/${id}`)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save Course
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
