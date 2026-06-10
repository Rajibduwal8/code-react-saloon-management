import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X } from "lucide-react";
import { clientValidationSchema } from "../../services/validationSchemas";
import CustomerService from "../../services/OrderingServices/CustomerService";
import CustomerTypeService from "../../services/OrderingServices/CustomerTypeService";
import CustomerMetaFieldService from "../../services/OrderingServices/CustomerMetaFieldService";
import toast from "react-hot-toast";

export default function AddCustomerModal({
  onClose,
  clientData = null,
  onSuccess = null,
}) {
  const isEditMode = !!clientData;
  const title = isEditMode ? "Edit Customer" : "Add New Customer";
  const subtitle = isEditMode
    ? "Update customer information"
    : "Register on the fly and auto select instantly";

  const [customerTypes, setCustomerTypes] = useState([]);
  const [metaFields, setMetaFields] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        const typesRes = await CustomerTypeService.getList();
        setCustomerTypes(typesRes?.items || []);
        
        const metaRes = await CustomerMetaFieldService.getList();
        // Assuming API returns array of meta fields directly or in .items
        setMetaFields(Array.isArray(metaRes) ? metaRes : (metaRes?.items || []));
      } catch (error) {
        console.error("Error fetching form configs:", error);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchConfigData();
  }, []);

  // Map existing meta values for edit mode
  const initialMetaValues = {};
  if (isEditMode && clientData.customerMetaValues) {
    clientData.customerMetaValues.forEach(m => {
      initialMetaValues[`meta_${m.metaFieldCode}`] = m.value;
    });
  }

  const initialValues = {
    firstName: clientData?.firstName || "",
    lastName: clientData?.lastName || "",
    email: clientData?.email || "",
    address: clientData?.address || "",
    phoneNo: clientData?.phoneNo || "",
    phoneNo2: clientData?.phoneNo2 || "",
    customerTypeId: clientData?.customerTypeId || "",
    ...initialMetaValues,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Reconstruct customerMetaValues array
      const customerMetaValues = metaFields.map(field => ({
        metaFieldCode: field.code,
        value: values[`meta_${field.code}`] || ""
      })).filter(m => m.value !== ""); // Only send filled ones

      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        address: values.address,
        phoneNo: values.phoneNo,
        phoneNo2: values.phoneNo2,
        customerTypeId: parseInt(values.customerTypeId, 10),
        customerMetaValues: customerMetaValues,
      };

      if (isEditMode) {
        await CustomerService.update(clientData.id, payload);
        toast.success("Customer updated successfully!");
      } else {
        await CustomerService.create(payload);
        toast.success("Customer created successfully!");
      }
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Failed to save customer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingConfig) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-[100]" />
        <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-xl z-[101] p-8 flex items-center justify-center">
          <p className="text-gray-500">Loading form...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[100]" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-[101] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800 font-serif">{title}</h2>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <Formik
            initialValues={initialValues}
            validationSchema={clientValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="input"
                      type="text"
                      name="firstName"
                      className={`w-full border rounded-md p-2 text-sm outline-none focus:border-blue-500 ${errors.firstName && touched.firstName ? "border-red-500" : "border-gray-300"}`}
                      placeholder="First Name"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-xs text-red-500 mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="input"
                      type="text"
                      name="lastName"
                      className={`w-full border rounded-md p-2 text-sm outline-none focus:border-blue-500 ${errors.lastName && touched.lastName ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Last Name"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-xs text-red-500 mt-1" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Customer Type <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="customerTypeId"
                    className={`w-full border rounded-md p-2 text-sm outline-none focus:border-blue-500 bg-white ${errors.customerTypeId && touched.customerTypeId ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select a Customer Type</option>
                    {customerTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="customerTypeId" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="input"
                    type="email"
                    name="email"
                    className={`w-full border rounded-md p-2 text-sm outline-none focus:border-blue-500 ${errors.email && touched.email ? "border-red-500" : "border-gray-300"}`}
                    placeholder="user@example.com"
                  />
                  <ErrorMessage name="email" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="input"
                    type="text"
                    name="address"
                    className={`w-full border rounded-md p-2 text-sm outline-none focus:border-blue-500 ${errors.address && touched.address ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Full Address"
                  />
                  <ErrorMessage name="address" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="input"
                      type="text"
                      name="phoneNo"
                      className={`w-full border rounded-md p-2 text-sm outline-none focus:border-blue-500 ${errors.phoneNo && touched.phoneNo ? "border-red-500" : "border-gray-300"}`}
                      placeholder="9800000000"
                    />
                    <ErrorMessage name="phoneNo" component="div" className="text-xs text-red-500 mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Secondary Phone
                    </label>
                    <Field
                      as="input"
                      type="text"
                      name="phoneNo2"
                      className={`w-full border rounded-md p-2 text-sm outline-none focus:border-blue-500 ${errors.phoneNo2 && touched.phoneNo2 ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Optional"
                    />
                    <ErrorMessage name="phoneNo2" component="div" className="text-xs text-red-500 mt-1" />
                  </div>
                </div>

                {/* Dynamic Meta Fields */}
                {metaFields.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">Additional Information</h3>
                    <div className="flex flex-col gap-4">
                      {metaFields.map(field => (
                        <div key={field.id}>
                          <label className="block text-sm font-medium mb-1" title={field.description}>
                            {field.title}
                          </label>
                          <Field
                            as="input"
                            type="text"
                            name={`meta_${field.code}`}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500"
                            placeholder={field.description || `Enter ${field.title}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fixed Footer Buttons */}
                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 px-4 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {isSubmitting ? "Saving..." : isEditMode ? "Update Customer" : "Save Customer"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
