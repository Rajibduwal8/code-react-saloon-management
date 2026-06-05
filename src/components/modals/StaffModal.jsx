import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X } from "lucide-react";
import { staffValidationSchema } from "../../services/validationSchemas";
import { createStaff, updateStaff } from "../../services/staffService";

export default function StaffModal({
  onClose,
  staffData = null,
  onSuccess = null,
}) {
  const isEditMode = !!staffData;
  const title = isEditMode ? "Edit Staff" : "Add New Staff";
  const subtitle = isEditMode
    ? "Update staff information"
    : "Register new staff member";

  const initialValues = staffData || {
    firstName: "",
    lastName: "",
    position: "",
    department: "",
    phone: "",
    email: "",
    salary: "",
    status: "ACTIVE",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await updateStaff(staffData.id, values);
      } else {
        await createStaff(values);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving staff:", error);
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
          validationSchema={staffValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div
                className="drawer-body"
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div>
                    <label className="form-label">
                      First Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      as="input"
                      type="text"
                      name="firstName"
                      className={`form-input ${errors.firstName && touched.firstName ? "error" : ""}`}
                      placeholder="Enter first name"
                    />
                    <ErrorMessage name="firstName">
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
                      Last Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      as="input"
                      type="text"
                      name="lastName"
                      className={`form-input ${errors.lastName && touched.lastName ? "error" : ""}`}
                      placeholder="Enter last name"
                    />
                    <ErrorMessage name="lastName">
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
                      Position <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      as="input"
                      type="text"
                      name="position"
                      className={`form-input ${errors.position && touched.position ? "error" : ""}`}
                      placeholder="e.g., Senior Therapist"
                    />
                    <ErrorMessage name="position">
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
                      Department <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      as="select"
                      name="department"
                      className={`form-select ${errors.department && touched.department ? "error" : ""}`}
                    >
                      <option value="">Select Department...</option>
                      <option value="Beauty Services">Beauty Services</option>
                      <option value="Academy">Academy</option>
                      <option value="Administration">Administration</option>
                    </Field>
                    <ErrorMessage name="department">
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
                      Phone <span style={{ color: "red" }}>*</span>
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
                      Email <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      as="input"
                      type="email"
                      name="email"
                      className={`form-input ${errors.email && touched.email ? "error" : ""}`}
                      placeholder="staff@wellness.com"
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
                      Salary <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      as="input"
                      type="number"
                      name="salary"
                      className={`form-input ${errors.salary && touched.salary ? "error" : ""}`}
                      placeholder="50000"
                    />
                    <ErrorMessage name="salary">
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
                      Status <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      as="select"
                      name="status"
                      className={`form-select ${errors.status && touched.status ? "error" : ""}`}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="ON_LEAVE">On Leave</option>
                    </Field>
                    <ErrorMessage name="status">
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
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
