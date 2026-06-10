import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import CategoryService from "../../../services/OrderingServices/CategoryService";

export default function CategoryForm({ modal, toggleModal, selectedItem, fetchList }) {
  if (!modal) return null;

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedItem?.name || "",
      description: selectedItem?.description || "",
      parentId: selectedItem?.parentId || "",
      imageName: selectedItem?.imageName || "",
      imagePath: selectedItem?.imagePath || "",
      portalId: selectedItem?.portalId || "",
      costCenterId: selectedItem?.costCenterId || "",
      categoryPosition: selectedItem?.categoryPosition || "",
      isHidden: selectedItem ? selectedItem.isHidden : false,
      isActive: selectedItem ? selectedItem.isActive : true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name is required"),
      description: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          name: values.name,
          description: values.description,
          parentId: values.parentId ? Number(values.parentId) : null,
          imageName: values.imageName || null,
          imagePath: values.imagePath || null,
          portalId: values.portalId ? Number(values.portalId) : null,
          costCenterId: values.costCenterId ? Number(values.costCenterId) : null,
          categoryPosition: values.categoryPosition ? Number(values.categoryPosition) : null,
          isHidden: values.isHidden,
          isActive: values.isActive,
        };

        if (selectedItem) {
          await CategoryService.update(selectedItem.id, payload);
          toast.success("Category updated successfully");
        } else {
          await CategoryService.create(payload);
          toast.success("Category created successfully");
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
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            {selectedItem ? "Edit" : "Add"} Category
          </h3>
          <button
            onClick={toggleModal}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">
          <form id="category-form" onSubmit={validation.handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                className={`w-full border rounded-md p-2.5 outline-none text-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-100 ${validation.touched.name && validation.errors.name ? "border-red-400" : "border-gray-300"}`}
                placeholder="Category name"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.name}
              />
              {validation.touched.name && validation.errors.name && (
                <p className="text-red-500 text-xs mt-1">{validation.errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 resize-none"
                placeholder="Optional description"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.description}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Parent ID</label>
                <input
                  type="number"
                  name="parentId"
                  className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-sm focus:border-blue-500"
                  placeholder="Optional"
                  onChange={validation.handleChange}
                  value={validation.values.parentId}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cost Center ID</label>
                <input
                  type="number"
                  name="costCenterId"
                  className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-sm focus:border-blue-500"
                  placeholder="Optional"
                  onChange={validation.handleChange}
                  value={validation.values.costCenterId}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Portal ID</label>
                <input
                  type="number"
                  name="portalId"
                  className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-sm focus:border-blue-500"
                  placeholder="Optional"
                  onChange={validation.handleChange}
                  value={validation.values.portalId}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input
                  type="number"
                  name="categoryPosition"
                  className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-sm focus:border-blue-500"
                  placeholder="Optional"
                  onChange={validation.handleChange}
                  value={validation.values.categoryPosition}
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  id="cat-isActive"
                  className="w-4 h-4 cursor-pointer accent-blue-600"
                  onChange={validation.handleChange}
                  checked={validation.values.isActive}
                />
                <label htmlFor="cat-isActive" className="text-sm font-medium cursor-pointer">Active</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isHidden"
                  id="cat-isHidden"
                  className="w-4 h-4 cursor-pointer accent-blue-600"
                  onChange={validation.handleChange}
                  checked={validation.values.isHidden}
                />
                <label htmlFor="cat-isHidden" className="text-sm font-medium cursor-pointer">Hidden</label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={toggleModal}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="category-form"
            disabled={validation.isSubmitting}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {validation.isSubmitting ? "Saving..." : selectedItem ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
