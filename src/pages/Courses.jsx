import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, X } from "lucide-react";
import {
  getCourses,
  createCourse,
  deleteCourse,
} from "../services/courseService";

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

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    title: "",
    rate: "",
    duration: "",
    instructor: "",
    category: "Hair Esthetics & Design",
    level: "Beginner Level",
    description: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleCreateCourse = async () => {
    const payload = {
      code: form.code,
      name: form.title,
      description: form.description,
      duration: form.duration,
      price: Number(form.rate) || 0,
      instructor: form.instructor,
      category: form.category,
      level: form.level,
      status: "ACTIVE",
    };
    try {
      const created = await createCourse(payload);
      setCourses((current) => [created, ...current]);
      setShowForm(false);
      setForm({
        code: "",
        title: "",
        rate: "",
        duration: "",
        instructor: "",
        category: "Hair Esthetics & Design",
        level: "Beginner Level",
        description: "",
      });
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      setCourses((current) =>
        current.filter((course) => String(course.id) !== String(id)),
      );
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div className="page-title">Course Catalog Menu</div>
            <div className="page-subtitle">
              Curate luxury formulations, products, pricing, session parameters,
              and categories.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="search-bar">
              <Search size={13} color="var(--muted)" />
              <input placeholder="Search ............" />
            </div>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={13} /> Add Course
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 28px 0" }}>
        {/* Add Form */}
        {showForm && (
          <div
            style={{
              background: "white",
              border: "1px solid var(--sand)",
              borderRadius: 12,
              padding: "24px",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--dark)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Configure New Academy Course
              </div>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted)",
                }}
              >
                <X size={15} />
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div>
                <label className="form-label">Course Code *</label>
                <input
                  className="form-input"
                  placeholder="Select Staff ......."
                  value={form.code}
                  onChange={(e) => set("code", e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Title Name *</label>
                <input
                  className="form-input"
                  placeholder="E.g. Advanced Balayage Artistry"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Course Rate ($) *</label>
                <input
                  className="form-input"
                  placeholder="E.g. 1200"
                  value={form.rate}
                  onChange={(e) => set("rate", e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Duration (Hours) *</label>
                <input
                  className="form-input"
                  placeholder="E.g. 90 MIN"
                  value={form.duration}
                  onChange={(e) => set("duration", e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Instructor Staff</label>
                <select
                  className="form-select"
                  value={form.instructor}
                  onChange={(e) => set("instructor", e.target.value)}
                >
                  <option value="">Select Staff .......</option>
                  <option>Staff Name 1</option>
                </select>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <label className="form-label">Category Group</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Proficiency Level</label>
                <select
                  className="form-select"
                  value={form.level}
                  onChange={(e) => set("level", e.target.value)}
                >
                  {LEVEL_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Exquisite Description</label>
                <input
                  className="form-input"
                  placeholder="High Precision Technical Styling Methods"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
            >
              <button className="btn-cancel" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button
                className="btn-submit"
                onClick={handleCreateCourse}
                type="button"
              >
                Save Course
              </button>
            </div>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {loading ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: 40,
                color: "var(--muted)",
              }}
            >
              Loading courses...
            </div>
          ) : courses.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: 40,
                color: "var(--muted)",
              }}
            >
              No courses available.
            </div>
          ) : (
            courses.map((c) => (
              <div key={c.id} className="service-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {c.category || "Course"}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--dark)",
                    }}
                  >
                    {c.price ? `NPR ${c.price}` : "NPR 0"}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--dark)",
                    marginBottom: 6,
                  }}
                >
                  {c.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    marginBottom: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {c.description}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--sand)",
                    paddingTop: 10,
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>
                    CODE: {c.code || c.id}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--brown)",
                      fontWeight: 600,
                    }}
                  >
                    DURATION: {c.duration}
                  </span>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => navigate(`/courses/${c.id}`)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => navigate(`/courses/${c.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => handleDeleteCourse(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
