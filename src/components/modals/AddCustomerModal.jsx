"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X } from "lucide-react";
import { clientValidationSchema } from "../../services/validationSchemas";
import { createClient, updateClient } from "../../services/clientService";

export default function AddCustomerModal({
  onClose,
  onBack,
  clientData = null,
  onSuccess = null,
}) {
  const isEditMode = !!clientData;
  const title = isEditMode ? "Edit Customer" : "Add New Customer";
  const subtitle = isEditMode
    ? "Update customer information"
    : "Register on the fly and auto select instantly";

  const initialValues = clientData || {
    firstName: "",
    lastName: "",
    nationalId: "",
    phone: "",
    email: "",
    skin: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await updateClient(clientData.id, values);
      } else {
        await createClient(values);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving client:", error);
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
          validationSchema={clientValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div
                className="drawer-body"
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
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
                        style={{ fontSize: 11, color: "#E05C5C", marginTop: 4 }}
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
                        style={{ fontSize: 11, color: "#E05C5C", marginTop: 4 }}
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
                        style={{ fontSize: 11, color: "#E05C5C", marginTop: 4 }}
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
                      Email <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      as="input"
                      type="email"
                      name="email"
                      className={`form-input ${errors.email && touched.email ? "error" : ""}`}
                      placeholder="user@gmail.com"
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

                <div>
                  <label className="form-label">
                    Skin Type <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    as="input"
                    type="text"
                    name="skin"
                    className={`form-input ${errors.skin && touched.skin ? "error" : ""}`}
                    placeholder="Dry, Combination, etc."
                  />
                  <ErrorMessage name="skin">
                    {(msg) => (
                      <div
                        style={{ fontSize: 11, color: "#E05C5C", marginTop: 4 }}
                      >
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>
              </div>

              <div className="drawer-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={onBack || onClose}
                >
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
