import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  CreditCard,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import PaymentTypeService from "../../services/OrderingServices/PaymentTypeService";
import PaymentTypeForm from "./component/PaymentTypeForm";
import DeleteModal from "../../components/common/DeleteModal";

const field = (row, key) => {
  const pascal = key.charAt(0).toUpperCase() + key.slice(1);
  return row?.[key] ?? row?.[pascal];
};

const isActive = (row) => field(row, "isActive") !== false;

export default function PaymentType() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await PaymentTypeService.getList();
      setList(Array.isArray(response) ? response : response?.items || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payment types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleAdd = () => {
    setSelectedItem(null);
    setAddModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setAddModal(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await PaymentTypeService.delete(selectedItem.id);
      toast.success("Payment type deleted successfully");
      fetchList();
      setDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete payment type");
    }
  };

  const filteredList = list.filter((item) => {
    const name = String(field(item, "name") || "").toLowerCase();
    const code = String(field(item, "code") || "").toLowerCase();
    const desc = String(field(item, "description") || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q || name.includes(q) || code.includes(q) || desc.includes(q);
    const matchStatus =
      !statusFilter ||
      (statusFilter === "active" ? isActive(item) : !isActive(item));
    return matchSearch && matchStatus;
  });

  const totalCount = list.length;
  const activeCount = list.filter((item) => isActive(item)).length;
  const inactiveCount = totalCount - activeCount;

  const columns = [
    {
      name: "S.N",
      selector: (row, index) => index + 1,
      width: "65px",
    },
    {
      name: "Code",
      selector: (row) => field(row, "code"),
      cell: (row) => (
        <span className="px-2 py-0.5 text-xs font-mono rounded bg-gray-100 text-gray-600">
          {field(row, "code") || "—"}
        </span>
      ),
    },
    {
      name: "Name",
      selector: (row) => field(row, "name"),
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-800">
          {field(row, "name") || "—"}
        </span>
      ),
    },
    {
      name: "Description",
      selector: (row) => field(row, "description") || "—",
      wrap: true,
    },
    {
      name: "Account Number",
      selector: (row) => field(row, "accountNumber") || "—",
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-0.5 text-xs rounded-full font-medium ${
            isActive(row)
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isActive(row) ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      width: "100px",
      right: true,
    },
  ];

  return (
    <div className="p-4 md:p-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Types</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage payment methods for appointments and billing
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors w-full md:w-auto justify-center"
        >
          <Plus size={18} /> Add Payment Type
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mr-4">
            <CreditCard size={22} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
              Total Types
            </p>
            <h3 className="text-2xl font-bold text-gray-800">{totalCount}</h3>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center">
          <div className="bg-green-100 p-3 rounded-lg text-green-600 mr-4">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
              Active
            </p>
            <h3 className="text-2xl font-bold text-gray-800">{activeCount}</h3>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center">
          <div className="bg-red-100 p-3 rounded-lg text-red-500 mr-4">
            <XCircle size={22} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
              Inactive
            </p>
            <h3 className="text-2xl font-bold text-gray-800">{inactiveCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50">
          <input
            type="text"
            placeholder="Search by name, code, or description..."
            className="w-full sm:max-w-xs px-4 py-2 border rounded-md text-sm outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="w-full sm:w-auto px-4 py-2 border rounded-md text-sm outline-none focus:border-blue-500 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={filteredList}
            progressPending={loading}
            pagination
            highlightOnHover
            responsive
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: "#f9fafb",
                  fontWeight: "bold",
                  color: "#374151",
                },
              },
              cells: { style: { padding: "12px 16px" } },
            }}
          />
        </div>

        <div className="block md:hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredList.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No payment types found
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 border-l-4 border-l-blue-500 rounded-lg shadow-sm p-4 relative"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow pr-10">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h6 className="font-bold text-gray-800">
                          {field(item, "name")}
                        </h6>
                        <span className="px-2 py-0.5 text-xs font-mono rounded bg-gray-100 text-gray-600">
                          {field(item, "code")}
                        </span>
                      </div>
                      {field(item, "description") && (
                        <p className="text-gray-500 text-sm mb-2">
                          {field(item, "description")}
                        </p>
                      )}
                      {field(item, "accountNumber") && (
                        <p className="text-gray-500 text-xs mb-2">
                          Account: {field(item, "accountNumber")}
                        </p>
                      )}
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          isActive(item)
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isActive(item) ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === item.id ? null : item.id,
                          )
                        }
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {openDropdownId === item.id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-10 py-1">
                          <button
                            type="button"
                            onClick={() => {
                              handleEdit(item);
                              setOpenDropdownId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleDeleteClick(item);
                              setOpenDropdownId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PaymentTypeForm
        modal={addModal}
        toggleModal={() => {
          setAddModal(false);
          setSelectedItem(null);
        }}
        selectedItem={selectedItem}
        fetchList={fetchList}
      />

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
    </div>
  );
}
