"use client";

import React, { useState, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X } from "lucide-react";
import { studentValidationSchema } from "../../services/validationSchemas";
import { createStudent, updateStudent } from "../../services/studentService";

export default function EnrollStudentModal({
  onClose,
  studentData = null,
  onSuccess = null,
}) {
  const isEditMode = !!studentData;
  const title = isEditMode
    ? "Edit Student Enrollment"
    : "Academy Course Enrollment";
  const subtitle = isEditMode
    ? "Update student enrollment details"
    : "Formulate active student academic pathways";

  const initialValues = studentData
    ? {
        ...studentData,
        student: studentData.name || studentData.student || "",
      }
    : {
        student: "",
        course: "",
        nationalId: "",
        code: "",
        email: "",
        phone: "",
        address: "",
        startDate: new Date().toISOString().split("T")[0],
        duration: "",
        courseRate: "",
        scholarship: 0,
        deposit: 5000,
      };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        ...values,
        name: values.student,
      };
      delete payload.student;

      if (isEditMode) {
        await updateStudent(studentData.id, payload);
      } else {
        await createStudent(payload);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving student:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 600,
                  color: "var(--dark)",
                }}
              >
                {title}
              </div>
              <div
                style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}
              >
                {subtitle}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={studentValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, values }) => {
            // Calculate payable amount
            const courseRate = parseFloat(values.courseRate) || 0;
            const scholarship = parseFloat(values.scholarship) || 0;
            const payable = courseRate - scholarship;

            return (
              <Form>
                <div
                  className="drawer-body"
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div>
                    <label className="form-label">
                      Student Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      as="select"
                      name="student"
                      className={`form-select ${errors.student && touched.student ? "error" : ""}`}
                    >
                      <option value="">Select Student...</option>
                      <option value="student1">Student Name 1</option>
                      <option value="student2">Student Name 2</option>
                    </Field>
                    <ErrorMessage name="student">
                      {(msg) => (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#E05C5C",
                            marginTop: 4,
                          }}
                        >
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>

                  <div>
                    <label className="form-label">
                      Course <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      as="select"
                      name="course"
                      className={`form-select ${errors.course && touched.course ? "error" : ""}`}
                    >
                      <option value="">Select Course...</option>
                      <option value="balayage">
                        Advanced Balayage Artistry
                      </option>
                      <option value="brows">
                        Lamination Brow Architecture
                      </option>
                    </Field>
                    <ErrorMessage name="course">
                      {(msg) => (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#E05C5C",
                            marginTop: 4,
                          }}
                        >
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>

                  <div>
                    <label className="form-label">
                      National ID <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      as="input"
                      type="text"
                      name="nationalId"
                      className={`form-input ${errors.nationalId && touched.nationalId ? "error" : ""}`}
                      placeholder="Xxxxxxxxxx"
                    />
                    <ErrorMessage name="nationalId">
                      {(msg) => (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#E05C5C",
                            marginTop: 4,
                          }}
                        >
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <label className="form-label">
                        Code <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        as="input"
                        type="text"
                        name="code"
                        className={`form-input ${errors.code && touched.code ? "error" : ""}`}
                        placeholder="Student ID Code"
                      />
                      <ErrorMessage name="code">
                        {(msg) => (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#E05C5C",
                              marginTop: 4,
                            }}
                          >
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                    <div>
                      <label className="form-label">
                        Email <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        as="input"
                        type="email"
                        name="email"
                        className={`form-input ${errors.email && touched.email ? "error" : ""}`}
                        placeholder="student@gmail.com"
                      />
                      <ErrorMessage name="email">
                        {(msg) => (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#E05C5C",
                              marginTop: 4,
                            }}
                          >
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <label className="form-label">
                        Phone Number <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        as="input"
                        type="text"
                        name="phone"
                        className={`form-input ${errors.phone && touched.phone ? "error" : ""}`}
                        placeholder="9801234567"
                      />
                      <ErrorMessage name="phone">
                        {(msg) => (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#E05C5C",
                              marginTop: 4,
                            }}
                          >
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                    <div>
                      <label className="form-label">
                        Address <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        as="input"
                        type="text"
                        name="address"
                        className={`form-input ${errors.address && touched.address ? "error" : ""}`}
                        placeholder="Enter address"
                      />
                      <ErrorMessage name="address">
                        {(msg) => (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#E05C5C",
                              marginTop: 4,
                            }}
                          >
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <label className="form-label">
                        Start Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        as="input"
                        type="date"
                        name="startDate"
                        className={`form-input ${errors.startDate && touched.startDate ? "error" : ""}`}
                      />
                      <ErrorMessage name="startDate">
                        {(msg) => (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#E05C5C",
                              marginTop: 4,
                            }}
                          >
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                    <div>
                      <label className="form-label">
                        Duration (Days) <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        as="input"
                        type="number"
                        name="duration"
                        className={`form-input ${errors.duration && touched.duration ? "error" : ""}`}
                        placeholder="45"
                      />
                      <ErrorMessage name="duration">
                        {(msg) => (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#E05C5C",
                              marginTop: 4,
                            }}
                          >
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <label className="form-label">
                        Course Rate <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        as="input"
                        type="number"
                        name="courseRate"
                        className={`form-input ${errors.courseRate && touched.courseRate ? "error" : ""}`}
                        placeholder="15000"
                      />
                      <ErrorMessage name="courseRate">
                        {(msg) => (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#E05C5C",
                              marginTop: 4,
                            }}
                          >
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                    <div>
                      <label className="form-label">
                        Scholarship / Discount ($)
                      </label>
                      <Field
                        as="input"
                        type="number"
                        name="scholarship"
                        className="form-input"
                        placeholder="0"
                      />
                      <ErrorMessage name="scholarship">
                        {(msg) => (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#E05C5C",
                              marginTop: 4,
                            }}
                          >
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  {/* Calculated */}
                  <div
                    style={{
                      background: "#FDFAF8",
                      border: "1px solid #E0D8D0",
                      borderRadius: 10,
                      padding: "14px 16px",
                      display: "flex",
                      gap: 20,
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: "var(--muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: 4,
                        }}
                      >
                        Calculated Payable
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "var(--dark)",
                        }}
                      >
                        NRS {payable.toFixed(0)}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Paid Deposit</label>
                      <Field
                        as="input"
                        type="number"
                        name="deposit"
                        className="form-input"
                        style={{ fontWeight: 600 }}
                        placeholder="5000"
                      />
                    </div>
                  </div>
                </div>

                <div className="drawer-footer">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Processing..."
                      : isEditMode
                        ? "Update Enrollment"
                        : "Submit Enrollment"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
}
