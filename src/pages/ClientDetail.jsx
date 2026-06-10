import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2Icon } from "lucide-react";
import CustomerService from "../services/OrderingServices/CustomerService";
import DeleteModal from "../components/common/DeleteModal";
import AddCustomerModal from "../components/modals/AddCustomerModal";

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchClient = async () => {
    try {
      const data = await CustomerService.getById(id);
      setClient(data);
    } catch (error) {
      console.error("Error fetching client:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    try {
      await CustomerService.delete(id);
      navigate("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-gray-500">Loading details...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8">
        <button
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
          onClick={() => navigate("/clients")}
        >
          <ArrowLeft size={16} /> Back to Clients
        </button>
        <div className="text-center text-gray-500">Client not found</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 border rounded-md hover:bg-gray-50 transition-colors" 
            onClick={() => navigate("/clients")}
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {client.firstName} {client.lastName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Client ID: {client.id} • Registered: {new Date(client.createdDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            onClick={() => setShowEditModal(true)}
          >
            <Edit size={16} /> Edit
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 bg-red-50 rounded-md text-sm font-medium hover:bg-red-100"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2Icon size={16} /> Delete
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Full Name</p>
                <p className="font-medium text-gray-800">{client.firstName} {client.lastName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Email</p>
                <p className="font-medium text-gray-800">{client.email || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Phone</p>
                <p className="font-medium text-gray-800">{client.phoneNo} {client.phoneNo2 ? ` / ${client.phoneNo2}` : ""}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Address</p>
                <p className="font-medium text-gray-800">{client.address || "-"}</p>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Customer Type</p>
                <div className="mt-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                    {client.customerTypeName}
                  </span>
                  {client.customerTypeDiscount > 0 && (
                    <span className="ml-2 text-xs text-green-600 font-medium">
                      ({client.customerTypeDiscount}% Discount)
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Total Orders</p>
                <p className="font-medium text-gray-800">{client.totalOrders}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Total Spent</p>
                <p className="font-medium text-gray-800">Rs. {client.totalOrderAmount?.toLocaleString() || "0"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Last Order Date</p>
                <p className="font-medium text-gray-800">
                  {client.lastOrderDate ? new Date(client.lastOrderDate).toLocaleDateString() : "Never"}
                </p>
              </div>
            </div>
          </div>

          {/* Meta Fields (Dynamic) */}
          {client.customerMetaValues && client.customerMetaValues.length > 0 && (
            <div className="md:col-span-2 mt-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {client.customerMetaValues.map((meta, idx) => (
                  <div key={idx}>
                    <p className="text-xs text-gray-500 uppercase">{meta.metaFieldCode}</p>
                    <p className="font-medium text-gray-800">{meta.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <AddCustomerModal 
          clientData={client} 
          onClose={() => setShowEditModal(false)} 
          onSuccess={fetchClient} 
        />
      )}

      <DeleteModal 
        show={showDeleteModal}
        onCloseClick={() => setShowDeleteModal(false)}
        onDeleteClick={handleDelete}
      />
    </div>
  );
}
