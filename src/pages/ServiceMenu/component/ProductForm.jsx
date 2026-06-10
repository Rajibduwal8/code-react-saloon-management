import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import ProductService from "../../../services/OrderingServices/ProductService";
import CategoryService from "../../../services/OrderingServices/CategoryService";
import UnitsService from "../../../services/OrderingServices/UnitsService";

export default function ProductForm({ modal, toggleModal, selectedItem, fetchList }) {
  if (!modal) return null;

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(selectedItem?.imagePath || null);
  const fileRef = useRef();

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [catRes, unitRes] = await Promise.all([
          CategoryService.getList({ PageSize: 200 }),
          UnitsService.getList(),
        ]);
        setCategories(catRes?.items || []);
        setUnits(Array.isArray(unitRes) ? unitRes : (unitRes?.items || []));
      } catch (err) {
        console.error("Failed to load form dropdowns", err);
      }
    };
    loadDropdowns();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      Name: selectedItem?.name || "",
      Description: selectedItem?.description || "",
      Price: selectedItem?.price || "",
      Code: selectedItem?.code || "",
      Sku: selectedItem?.sku || "",
      TaxBillTitle: selectedItem?.taxBillTitle || "",
      Tags: selectedItem?.tags || "",
      CategoryId: selectedItem?.categoryId || "",
      UnitId: selectedItem?.unitId || "",
      ProductPosition: selectedItem?.productPosition || "",
      MinimunStockQuantity: selectedItem?.minimunStockQuantity || 0,
      IsMenuDisplay: selectedItem?.isMenuDisplay ?? true,
      IsHidden: selectedItem?.isHidden ?? false,
      IsProductSoldOut: selectedItem?.isProductSoldOut ?? false,
      IsService: selectedItem?.isService ?? false,
      CanUserCustomizePrice: selectedItem?.canUserCustomizePrice ?? false,
      IsStockManaged: selectedItem?.isStockManaged ?? false,
    },
    validationSchema: Yup.object({
      Name: Yup.string().required("Product name is required"),
      Price: Yup.number().required("Price is required").min(0),
    }),
    onSubmit: async (values) => {
      try {
        if (selectedItem) {
          await ProductService.update(selectedItem.id, values, imageFile);
          toast.success("Product updated successfully");
        } else {
          await ProductService.create(values, imageFile);
          toast.success("Product created successfully");
        }
        fetchList();
        toggleModal();
      } catch (err) {
        toast.error("Failed to save product. Please try again.");
        console.error(err);
      }
    },
  });

  const CheckField = ({ name, label }) => (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={`pf-${name}`}
        name={name}
        className="w-4 h-4 accent-blue-600 cursor-pointer"
        checked={validation.values[name]}
        onChange={validation.handleChange}
      />
      <label htmlFor={`pf-${name}`} className="text-sm font-medium cursor-pointer select-none">{label}</label>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[100]" onClick={toggleModal} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-[101] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {selectedItem ? "Edit Product / Service" : "Add Product / Service"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Fill in the details below</p>
          </div>
          <button onClick={toggleModal} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="product-form" onSubmit={validation.handleSubmit}>
            {/* Image Upload */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Product Image</label>
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors min-h-[120px]"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-28 object-contain rounded" />
                ) : (
                  <>
                    <ImageIcon size={32} className="text-gray-300" />
                    <p className="text-xs text-gray-500">Click to upload image</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>

            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
                <input
                  type="text" name="Name"
                  className={`w-full border rounded-md p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 ${validation.touched.Name && validation.errors.Name ? "border-red-400" : "border-gray-300"}`}
                  placeholder="Product or service name"
                  onChange={validation.handleChange} onBlur={validation.handleBlur} value={validation.values.Name}
                />
                {validation.touched.Name && validation.errors.Name && <p className="text-red-500 text-xs mt-1">{validation.errors.Name}</p>}
              </div>

              {/* Price & Position */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Price <span className="text-red-500">*</span></label>
                  <input
                    type="number" name="Price" step="0.01"
                    className={`w-full border rounded-md p-2.5 text-sm outline-none focus:border-blue-500 ${validation.touched.Price && validation.errors.Price ? "border-red-400" : "border-gray-300"}`}
                    placeholder="0.00"
                    onChange={validation.handleChange} onBlur={validation.handleBlur} value={validation.values.Price}
                  />
                  {validation.touched.Price && validation.errors.Price && <p className="text-red-500 text-xs mt-1">{validation.errors.Price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Position</label>
                  <input
                    type="number" name="ProductPosition"
                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm outline-none focus:border-blue-500"
                    placeholder="Optional"
                    onChange={validation.handleChange} value={validation.values.ProductPosition}
                  />
                </div>
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    name="CategoryId"
                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm outline-none focus:border-blue-500 bg-white"
                    onChange={validation.handleChange} value={validation.values.CategoryId}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <select
                    name="UnitId"
                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm outline-none focus:border-blue-500 bg-white"
                    onChange={validation.handleChange} value={validation.values.UnitId}
                  >
                    <option value="">Select unit</option>
                    {units.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.code})</option>)}
                  </select>
                </div>
              </div>

              {/* Code, SKU */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Code</label>
                  <input type="text" name="Code" className="w-full border border-gray-300 rounded-md p-2.5 text-sm outline-none focus:border-blue-500" placeholder="e.g. PROD001" onChange={validation.handleChange} value={validation.values.Code} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <input type="text" name="Sku" className="w-full border border-gray-300 rounded-md p-2.5 text-sm outline-none focus:border-blue-500" placeholder="e.g. SKU001" onChange={validation.handleChange} value={validation.values.Sku} />
                </div>
              </div>

              {/* Tax Bill Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Tax Bill Title</label>
                <input type="text" name="TaxBillTitle" className="w-full border border-gray-300 rounded-md p-2.5 text-sm outline-none focus:border-blue-500" placeholder="Appears on bill" onChange={validation.handleChange} value={validation.values.TaxBillTitle} />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <input type="text" name="Tags" className="w-full border border-gray-300 rounded-md p-2.5 text-sm outline-none focus:border-blue-500" placeholder="e.g. organic, vegan" onChange={validation.handleChange} value={validation.values.Tags} />
              </div>

              {/* Min Stock Qty */}
              <div>
                <label className="block text-sm font-medium mb-1">Minimum Stock Quantity</label>
                <input type="number" name="MinimunStockQuantity" className="w-full border border-gray-300 rounded-md p-2.5 text-sm outline-none focus:border-blue-500" onChange={validation.handleChange} value={validation.values.MinimunStockQuantity} />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="Description" rows={3} className="w-full border border-gray-300 rounded-md p-2.5 text-sm outline-none focus:border-blue-500 resize-none" placeholder="Optional description" onChange={validation.handleChange} value={validation.values.Description} />
              </div>

              {/* Boolean Flags */}
              <div className="border border-gray-100 bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-3">
                <CheckField name="IsMenuDisplay" label="Show in Menu" />
                <CheckField name="IsService" label="Is Service" />
                <CheckField name="IsHidden" label="Hidden" />
                <CheckField name="IsProductSoldOut" label="Sold Out" />
                <CheckField name="CanUserCustomizePrice" label="Custom Price" />
                <CheckField name="IsStockManaged" label="Manage Stock" />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end px-6 py-4 border-t bg-gray-50 flex-shrink-0">
          <button type="button" onClick={toggleModal} className="px-5 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">Cancel</button>
          <button
            type="submit"
            form="product-form"
            disabled={validation.isSubmitting}
            className="px-5 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {validation.isSubmitting ? "Saving..." : selectedItem ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}
