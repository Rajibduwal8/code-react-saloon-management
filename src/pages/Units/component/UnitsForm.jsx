import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import UnitsService from "../../../services/OrderingServices/UnitsService";

export default function UnitsForm({ modal, toggleModal, selectedItem, fetchList }) {
  if (!modal) return null;

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedItem?.name || "",
      code: selectedItem?.code || "",
      description: selectedItem?.description || "",
      ratio: selectedItem?.ratio ?? 1,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Unit name is required"),
      code: Yup.string().required("Unit code is required"),
      description: Yup.string(),
      ratio: Yup.number().min(0).required("Ratio is required"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          name: values.name,
          code: values.code,
          description: values.description,
          ratio: Number(values.ratio),
        };
        if (selectedItem) {
          await UnitsService.update(selectedItem.id, payload);
          toast.success("Unit updated successfully");
        } else {
          await UnitsService.create(payload);
          toast.success("Unit created successfully");
        }
        fetchList();
        toggleModal();
      } catch (error) {
        toast.error("An error occurred. Please try again.");
        console.error(error);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            {selectedItem ? "Edit" : "Add"} Unit
          </h3>
          <button
            onClick={toggleModal}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={validation.handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              className={`w-full border rounded-md p-2.5 outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 ${validation.touched.name && validation.errors.name ? "border-red-400" : "border-gray-300"}`}
              placeholder="e.g. Kilogram"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.name}
            />
            {validation.touched.name && validation.errors.name && (
              <p className="text-red-500 text-xs mt-1">{validation.errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                className={`w-full border rounded-md p-2.5 outline-none text-sm focus:border-blue-500 ${validation.touched.code && validation.errors.code ? "border-red-400" : "border-gray-300"}`}
                placeholder="e.g. kg"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.code}
              />
              {validation.touched.code && validation.errors.code && (
                <p className="text-red-500 text-xs mt-1">{validation.errors.code}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Ratio <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="ratio"
                className={`w-full border rounded-md p-2.5 outline-none text-sm focus:border-blue-500 ${validation.touched.ratio && validation.errors.ratio ? "border-red-400" : "border-gray-300"}`}
                placeholder="e.g. 1000"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.ratio}
              />
              {validation.touched.ratio && validation.errors.ratio && (
                <p className="text-red-500 text-xs mt-1">{validation.errors.ratio}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-sm focus:border-blue-500 resize-none"
              placeholder="Optional description"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.description}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t mt-2">
            <button
              type="button"
              onClick={toggleModal}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={validation.isSubmitting}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {validation.isSubmitting ? "Saving..." : selectedItem ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
