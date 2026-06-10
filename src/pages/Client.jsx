import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditIcon, Eye, Plus, Trash2Icon } from "lucide-react";
import DataTable from "react-data-table-component";
import AddCustomerModal from "../components/modals/AddCustomerModal";
import CustomerService from "../services/OrderingServices/CustomerService";
import DeleteModal from "../components/common/DeleteModal";

export default function Client() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Server-side pagination and filtering
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const fetchClients = async (page = 1, size = perPage, search = searchQuery) => {
    try {
      setLoading(true);
      const response = await CustomerService.getList({
        Page: page,
        PageSize: size,
        Search: search,
      });
      setClients(response.items || []);
      setTotalRows(response.totalCount || 0);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(currentPage, perPage, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage]);

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1); // Changing page will trigger the fetch
      } else {
        fetchClients(1, perPage, searchQuery);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedClient) {
      try {
        await CustomerService.delete(selectedClient.id);
        fetchClients(currentPage, perPage, searchQuery);
        setDeleteModal(false);
        setSelectedClient(null);
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleAddSuccess = () => {
    fetchClients(currentPage, perPage, searchQuery);
  };

  const columns = [
    {
      name: "S.N",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      sortable: false,
      width: "75px",
    },
    {
      name: "Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Address",
      selector: (row) => row.address,
    },
    {
      name: "Phone",
      selector: (row) => row.phoneNo,
    },
    {
      name: "Type",
      cell: (row) => (
        <span className="px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-700">
          {row.customerTypeName || "Standard"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/clients/${row.id}`)}
            className="text-green-600 hover:text-green-800 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => {
              // Instead of navigating, we'll open modal. But user had edit page in router.
              // We'll open modal with edit mode to reuse AddCustomerModal.
              setSelectedClient(row);
              setShowModal(true);
            }}
            className="text-yellow-600 hover:text-yellow-800 transition-colors"
            title="Edit"
          >
            <EditIcon size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Delete"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
      ),
      width: "120px",
      right: true,
    },
  ];

  return (
    <div className="p-4 md:p-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Client Enrollment Log</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage customers, view order history, and track communication.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors w-full md:w-auto justify-center" 
            onClick={() => { setSelectedClient(null); setShowModal(true); }}
          >
            <Plus size={18} />
            Add Customer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header and Search */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Client List
          </div>
          <div className="w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Search Client with Name / Phone / Email"
              className="w-full px-4 py-2 border rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={clients}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          highlightOnHover
          responsive
          customStyles={{
            headRow: { style: { backgroundColor: '#f9fafb', fontWeight: 'bold', color: '#374151' } },
            cells: { style: { padding: '12px 16px' } }
          }}
        />
      </div>

      {showModal && (
        <AddCustomerModal
          onClose={() => { setShowModal(false); setSelectedClient(null); }}
          onSuccess={handleAddSuccess}
          clientData={selectedClient}
        />
      )}

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
    </div>
  );
}
