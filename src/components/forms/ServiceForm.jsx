"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
  getProductById,
  createProduct,
  updateProduct,
} from "../../services/productService";
import FileDropzone from "./FileDropzone";

const validationSchema = Yup.object({
  name: Yup.string().required("Product Name is required"),
  description: Yup.string(),
  minimunStockQuantity: Yup.number()
    .min(0, "Quantity cannot be negative")
    .when("isStockManaged", {
      is: true,
      then: (schema) => schema.required("Minimum stock is required"),
    }),
  itemPosition: Yup.number()
    .min(0, "Item position cannot be negative")
    .required("Item position is required"),
  price: Yup.number().min(0, "Price cannot be negative"),
  categoryId: Yup.number()
    .min(1, "Please select a category")
    .required("Category is required"),
});

export default function ServiceForm({ id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitRef = useRef(false);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [initialData, setInitialData] = useState(null);

  // Mock data for dropdowns (Replace with real APIs later)
  const categoryOptions = [
    { value: 1, label: "Facials" },
    { value: 2, label: "Massage" },
    { value: 3, label: "Hair Care" },
  ];
  
  const unitOptions = [
    { value: 1, label: "Session" },
    { value: 2, label: "Piece" },
    { value: 3, label: "Hour" },
  ];

  useEffect(() => {
    if (id) {
      const fetchItemDetail = async () => {
        try {
          const response = await getProductById(id);
          setInitialData(response);
          if (response?.image) {
            setSelectedFiles([
              { isExisting: true, preview: response.image },
            ]);
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to load product details");
        }
      };
      fetchItemDetail();
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      id: initialData?.id || 0,
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      tags: initialData?.tags || "",
      code: initialData?.code || "",
      sku: initialData?.sku || "",
      taxBillTitle: initialData?.taxBillTitle || "",
      categoryId: initialData?.categoryId || "",
      parentId: initialData?.parentId || null,
      isHidden: initialData?.isHidden || false,
      isProductSoldOut: initialData?.isProductSoldOut || false,
      isService: initialData?.isService || true, // Defaulting to true as it's a ServiceMenu
      itemPosition: initialData?.productPosition || 0,
      minimunStockQuantity: initialData?.minimunStockQuantity || 0,
      isStockManaged: initialData?.isStockManaged || false,
      units: initialData?.units?.length
        ? initialData.units
        : [
            {
              id: 0,
              unitId: 0,
              rate: 1,
              sellingPrice: 0,
              purchasePrice: 0,
              isDefault: true,
            },
          ],
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (submitRef.current) return;
      submitRef.current = true;
      try {
        setIsSubmitting(true);
        const formData = new FormData();

        formData.append("id", values.id);
        formData.append("name", values.name);
        formData.append("slug", values.slug || "");
        formData.append("description", values.description);
        formData.append("price", values.price.toString());
        formData.append("tags", values.tags);
        formData.append("code", values.code || "");
        formData.append("sku", values.sku || "");
        formData.append("taxBillTitle", values.taxBillTitle || "");
        formData.append("isHidden", values.isHidden.toString());
        formData.append("isProductSoldOut", values.isProductSoldOut.toString());
        formData.append("isService", values.isService.toString());
        formData.append("productPosition", values.itemPosition.toString());
        formData.append("MinimunStockQuantity", values.minimunStockQuantity.toString());
        formData.append("IsStockManaged", values.isStockManaged.toString());

        if (values.categoryId) {
          formData.append("categoryId", values.categoryId.toString());
        }

        const validUnits = (values.units || []).filter((unit) => unit && unit.unitId > 0);
        if (validUnits.length > 0) {
          validUnits.forEach((unit, index) => {
            formData.append(`units[${index}].id`, `${parseInt(unit.id ?? 0)}`);
            formData.append(`units[${index}].unitId`, `${parseInt(unit.unitId ?? 0)}`);
            formData.append(`units[${index}].rate`, `${parseInt(unit.rate ?? 0)}`);
            formData.append(`units[${index}].sellingPrice`, `${parseInt(unit.sellingPrice ?? 0)}`);
            formData.append(`units[${index}].purchasePrice`, `${parseInt(unit.purchasePrice ?? 0)}`);
            formData.append(`units[${index}].isDefault`, unit.isDefault ? "true" : "false");
          });
        }

        if (selectedFiles.length > 0) {
          const fileObj = selectedFiles[0];
          if (!fileObj.isExisting && fileObj.payload instanceof File) {
            formData.append("Image", fileObj.payload);
          }
        }

        if (id) {
          await updateProduct(id, formData);
          toast.success("Service updated successfully!");
        } else {
          await createProduct(formData);
          resetForm();
          toast.success("Service created successfully!");
        }
        router.push("/services");
      } catch (error) {
        console.error("Submit Error:", error);
        toast.error("Failed to save product.");
      } finally {
        setIsSubmitting(false);
        submitRef.current = false;
      }
    },
  });

  const getFirstError = (errs) => {
    for (const key of Object.keys(errs)) {
      const error = errs[key];
      if (typeof error === "string") return error;
      if (error && typeof error === "object") {
        const nested = getFirstError(error);
        if (nested) return nested;
      }
    }
    return null;
  };

  useEffect(() => {
    if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
      const firstError = getFirstError(formik.errors);
      if (firstError) toast.error(firstError);
    }
  }, [formik.submitCount, formik.errors]);

  const handleAddUnit = () => {
    const newUnit = {
      id: 0,
      unitId: 0,
      rate: 0,
      sellingPrice: 0,
      purchasePrice: 0,
      isDefault: formik.values.units.length === 0,
    };
    formik.setFieldValue("units", [...formik.values.units, newUnit]);
  };

  const handleRemoveUnit = (index) => {
    const updatedUnits = [...formik.values.units];
    const removedUnit = updatedUnits.splice(index, 1)[0];
    if (removedUnit.isDefault && updatedUnits.length > 0) {
      updatedUnits[0].isDefault = true;
    }
    formik.setFieldValue("units", updatedUnits);
  };

  return (
    <form onSubmit={formik.handleSubmit} style={{ padding: "0 28px 32px" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
        {["1: General Info", "2: Units & Pricing"].map((tab) => {
          const tabId = tab.split(":")[0];
          const tabName = tab.split(":")[1];
          return (
            <button
              key={tabId}
              type="button"
              onClick={() => setActiveTab(tabId)}
              style={{
                background: activeTab === tabId ? "#ebf8ff" : "transparent",
                color: activeTab === tabId ? "#3182ce" : "#718096",
                border: activeTab === tabId ? "1px solid #bee3f8" : "1px solid transparent",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tabName}
            </button>
          );
        })}
      </div>

      {activeTab === "1" && (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          {/* Main Info */}
          <div className="stat-card" style={{ padding: "24px" }}>
            <h6 style={{ marginBottom: "20px", fontWeight: 600, fontSize: "16px" }}>Basic Information</h6>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <label className="form-label">Product Name *</label>
                <input
                  className="form-input"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  placeholder="Enter product name"
                />
                {formik.touched.name && formik.errors.name && (
                  <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>{formik.errors.name}</div>
                )}
              </div>

              <div>
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  name="categoryId"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                >
                  <option value="">Select Category...</option>
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {formik.touched.categoryId && formik.errors.categoryId && (
                  <div style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}>{formik.errors.categoryId}</div>
                )}
              </div>

              <div>
                <label className="form-label">Item Position *</label>
                <input
                  className="form-input"
                  type="number"
                  name="itemPosition"
                  value={formik.values.itemPosition}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label className="form-label">Code</label>
                <input className="form-input" name="code" value={formik.values.code} onChange={formik.handleChange} />
              </div>

              <div>
                <label className="form-label">SKU</label>
                <input className="form-input" name="sku" value={formik.values.sku} onChange={formik.handleChange} />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  name="description"
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div style={{ background: "#f8f9fa", padding: "16px", borderRadius: "8px", display: "flex", gap: "24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
                <input type="checkbox" name="isHidden" checked={formik.values.isHidden} onChange={formik.handleChange} />
                Non-sellable
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
                <input type="checkbox" name="isService" checked={formik.values.isService} onChange={formik.handleChange} />
                Is Service
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
                <input type="checkbox" name="isStockManaged" checked={formik.values.isStockManaged} onChange={formik.handleChange} />
                Manage Stock
              </label>
            </div>
          </div>

          {/* Image */}
          <div className="stat-card" style={{ padding: "24px", height: "fit-content" }}>
            <h6 style={{ marginBottom: "20px", fontWeight: 600, fontSize: "16px" }}>Product Image</h6>
            <FileDropzone
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              formik={formik}
              existingImage={initialData?.image}
            />
          </div>
        </div>
      )}

      {activeTab === "2" && (
        <div className="stat-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <h6 style={{ fontWeight: 600, fontSize: "16px", margin: 0 }}>Units & Pricing</h6>
            <button type="button" onClick={handleAddUnit} className="btn-primary" style={{ padding: "6px 12px", fontSize: "12px" }}>
              + Add Unit
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {formik.values.units.map((unit, index) => (
              <div key={index} style={{ border: "1px solid #e2e8f0", padding: "16px", borderRadius: "8px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "16px", alignItems: "end" }}>
                <div>
                  <label className="form-label">Unit</label>
                  <select
                    className="form-select"
                    name={`units[${index}].unitId`}
                    value={unit.unitId}
                    onChange={formik.handleChange}
                  >
                    <option value={0}>Select Unit...</option>
                    {unitOptions.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Selling Price</label>
                  <input
                    className="form-input"
                    type="number"
                    name={`units[${index}].sellingPrice`}
                    value={unit.sellingPrice}
                    onChange={formik.handleChange}
                  />
                </div>
                <div>
                  <label className="form-label">Purchase Price</label>
                  <input
                    className="form-input"
                    type="number"
                    name={`units[${index}].purchasePrice`}
                    value={unit.purchasePrice}
                    onChange={formik.handleChange}
                  />
                </div>
                <div style={{ paddingBottom: "10px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="defaultUnit"
                      checked={unit.isDefault}
                      onChange={() => {
                        const newUnits = formik.values.units.map((u, i) => ({ ...u, isDefault: i === index }));
                        formik.setFieldValue("units", newUnits);
                      }}
                    />
                    Default Unit
                  </label>
                </div>
                <button type="button" onClick={() => handleRemoveUnit(index)} style={{ background: "#e53e3e", color: "white", border: "none", borderRadius: "4px", padding: "8px 12px", cursor: "pointer" }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
        <button type="button" onClick={() => router.push("/services")} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-submit" style={{ background: "#48bb78" }}>
          {isSubmitting ? "Saving..." : (id ? "Update Service" : "Save Service")}
        </button>
      </div>
    </form>
  );
}
