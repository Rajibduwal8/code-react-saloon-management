import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import CustomerMetaFieldService from "../../../services/OrderingServices/CustomerMetaFieldService";

export default function CustomerMetaFieldForm({ modal, toggleModal, selectedUnit, fetchUnit }) {
  if (!modal) return null;

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      code: selectedUnit?.code || "",
      title: selectedUnit?.title || "",
      description: selectedUnit?.description || "",
      type: selectedUnit?.type || "text",
      isRequired: selectedUnit ? selectedUnit.isRequired : false,
      isActive: selectedUnit ? selectedUnit.isActive : true,
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Please enter a code (e.g. allergies)"),
      title: Yup.string().required("Please enter a title"),
      type: Yup.string().required("Please select a field type"),
    }),
    onSubmit: async (values) => {
      try {
        if (selectedUnit) {
          await CustomerMetaFieldService.update(selectedUnit.id, values);
          toast.success("Customer Metafield updated successfully");
        } else {
          await CustomerMetaFieldService.create(values);
          toast.success("Customer Metafield created successfully");
        }
        fetchUnit();
        toggleModal();
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">{selectedUnit ? "Edit" : "Add"} Customer Metafield</h3>
          <button onClick={toggleModal} className="text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
        </div>
        <form onSubmit={validation.handleSubmit} className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Code <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="code"
              className="w-full border rounded-md p-2 outline-none focus:border-blue-500 text-sm"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.code}
              disabled={!!selectedUnit}
            />
            {validation.touched.code && validation.errors.code && <div className="text-red-500 text-xs mt-1">{validation.errors.code}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              className="w-full border rounded-md p-2 outline-none focus:border-blue-500 text-sm"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.title}
            />
            {validation.touched.title && validation.errors.title && <div className="text-red-500 text-xs mt-1">{validation.errors.title}</div>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              className="w-full border rounded-md p-2 outline-none focus:border-blue-500 text-sm"
              rows={2}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.description}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Field Type <span className="text-red-500">*</span></label>
            <select
              name="type"
              className="w-full border rounded-md p-2 outline-none focus:border-blue-500 text-sm"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.type}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Yes/No (Boolean)</option>
              <option value="date">Date</option>
            </select>
            {validation.touched.type && validation.errors.type && <div className="text-red-500 text-xs mt-1">{validation.errors.type}</div>}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isRequired"
              id="isRequired"
              className="w-4 h-4 cursor-pointer accent-blue-600"
              onChange={validation.handleChange}
              checked={validation.values.isRequired}
            />
            <label htmlFor="isRequired" className="text-sm font-medium cursor-pointer">Is Required</label>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              className="w-4 h-4 cursor-pointer accent-blue-600"
              onChange={validation.handleChange}
              checked={validation.values.isActive}
            />
            <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">Active</label>
          </div>
          
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <button type="button" onClick={toggleModal} className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
