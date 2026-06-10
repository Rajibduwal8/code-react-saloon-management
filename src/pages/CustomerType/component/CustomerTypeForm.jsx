import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import CustomerTypeService from "../../../services/OrderingServices/CustomerTypeService";

export default function CustomerTypeForm({ modal, toggleModal, selectedUnit, fetchUnit }) {
  if (!modal) return null;

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedUnit?.name || "",
      description: selectedUnit?.description || "",
      discountPercentage: selectedUnit?.discountPercentage || 0,
      isActive: selectedUnit ? selectedUnit.isActive : true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter a name"),
      description: Yup.string(),
      discountPercentage: Yup.number().min(0).max(100).required("Discount percentage is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (selectedUnit) {
          await CustomerTypeService.update(selectedUnit.id, values);
          toast.success("Customer Type updated successfully");
        } else {
          await CustomerTypeService.create(values);
          toast.success("Customer Type created successfully");
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
          <h3 className="text-lg font-bold">{selectedUnit ? "Edit" : "Add"} Customer Type</h3>
          <button onClick={toggleModal} className="text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
        </div>
        <form onSubmit={validation.handleSubmit} className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              className="w-full border rounded-md p-2 outline-none focus:border-blue-500 text-sm"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.name}
            />
            {validation.touched.name && validation.errors.name && <div className="text-red-500 text-xs mt-1">{validation.errors.name}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              className="w-full border rounded-md p-2 outline-none focus:border-blue-500 text-sm"
              rows={3}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.description}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discount Percentage (%) <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="discountPercentage"
              className="w-full border rounded-md p-2 outline-none focus:border-blue-500 text-sm"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.discountPercentage}
            />
            {validation.touched.discountPercentage && validation.errors.discountPercentage && <div className="text-red-500 text-xs mt-1">{validation.errors.discountPercentage}</div>}
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
