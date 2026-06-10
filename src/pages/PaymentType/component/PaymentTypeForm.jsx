import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import PaymentTypeService from "../../../services/OrderingServices/PaymentTypeService";

const getValue = (item, key) => {
  if (!item) return undefined;
  const pascal = key.charAt(0).toUpperCase() + key.slice(1);
  return item[key] ?? item[pascal];
};

export default function PaymentTypeForm({
  modal,
  toggleModal,
  selectedItem,
  fetchList,
}) {
  if (!modal) return null;

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      code: getValue(selectedItem, "code") || "",
      name: getValue(selectedItem, "name") || "",
      description: getValue(selectedItem, "description") || "",
      accountNumber: getValue(selectedItem, "accountNumber") || "",
      isActive: selectedItem ? getValue(selectedItem, "isActive") !== false : true,
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Code is required"),
      name: Yup.string().required("Name is required"),
      description: Yup.string(),
      accountNumber: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          Code: values.code,
          Name: values.name,
          Description: values.description || "",
          AccountNumber: values.accountNumber || "",
          IsActive: values.isActive,
        };
        if (selectedItem) {
          await PaymentTypeService.update(selectedItem.id, payload);
          toast.success("Payment type updated successfully");
        } else {
          await PaymentTypeService.create(payload);
          toast.success("Payment type created successfully");
        }
        fetchList();
        toggleModal();
      } catch (error) {
        console.error(error);
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            {selectedItem ? "Edit" : "Add"} Payment Type
          </h3>
          <button
            type="button"
            onClick={toggleModal}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={validation.handleSubmit}
          className="p-5 flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-sm focus:border-blue-500"
                placeholder="e.g. CASH"
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
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-sm focus:border-blue-500"
                placeholder="e.g. Cash"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.name}
              />
              {validation.touched.name && validation.errors.name && (
                <p className="text-red-500 text-xs mt-1">{validation.errors.name}</p>
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

          <div>
            <label className="block text-sm font-medium mb-1">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              className="w-full border border-gray-300 rounded-md p-2.5 outline-none text-sm focus:border-blue-500"
              placeholder="Optional account number"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.accountNumber}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              id="paymentTypeIsActive"
              className="w-4 h-4 cursor-pointer accent-blue-600"
              onChange={validation.handleChange}
              checked={validation.values.isActive}
            />
            <label
              htmlFor="paymentTypeIsActive"
              className="text-sm font-medium cursor-pointer"
            >
              Active
            </label>
          </div>

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
