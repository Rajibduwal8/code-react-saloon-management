import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Plus, MoreVertical, Edit2, Trash2, Users, Tag, ToggleRight, ToggleLeft } from "lucide-react";
import CustomerTypeService from "../../services/OrderingServices/CustomerTypeService";
import CustomerTypeForm from "./component/CustomerTypeForm";
import DeleteModal from "../../components/common/DeleteModal";

export default function CustomerType() {
  const [unitList, setUnitList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Summary stats
  const [totalCustomerTypes, setTotalCustomerTypes] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [activeCustomerTypes, setActiveCustomerTypes] = useState(0);
  const [inactiveCustomerTypes, setInactiveCustomerTypes] = useState(0);
  
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUnitList = async () => {
    try {
      setLoading(true);
      const response = await CustomerTypeService.getList();
      setUnitList(response?.items || []);
      setTotalCustomerTypes(response.summary?.totalCustomerTypes || 0);
      setTotalCustomers(response.summary?.totalCustomers || 0);
      setActiveCustomerTypes(response.summary?.activeCustomerTypes || 0);
      setInactiveCustomerTypes(response.summary?.inactiveCustomerTypes || 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUnitList();
  }, []);

  const handleAdd = () => {
    setSelectedUnit(null);
    setAddModal(true);
  };

  const handleEdit = (unit) => {
    setSelectedUnit(unit);
    setAddModal(true);
  };

  const handleDeleteClick = (unit) => {
    setSelectedUnit(unit);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedUnit) {
      try {
        await CustomerTypeService.delete(selectedUnit.id);
        setUnitList((prev) => prev.filter((unit) => unit.id !== selectedUnit.id));
        setDeleteModal(false);
        setSelectedUnit(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const columns = [
    {
      name: "S.N",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "75px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Total Customers",
      selector: (row) => row.totalCustomers,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Discount (%)",
      selector: (row) => row.discountPercentage,
      sortable: true,
      right: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <button onClick={() => handleEdit(row)} className="text-blue-500 hover:text-blue-700 transition-colors"><Edit2 size={16} /></button>
          <button onClick={() => handleDeleteClick(row)} className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={16} /></button>
        </div>
      ),
      width: "100px",
      right: true,
    }
  ];

  const filteredUnitList = unitList.filter((unit) => {
    const matchStatus = !statusFilter || (statusFilter === "active" ? unit.isActive : !unit.isActive);
    const matchSearch = !searchQuery || unit.name.toLowerCase().includes(searchQuery.toLowerCase()) || unit.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Types</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your customer types and discounts</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors w-full md:w-auto justify-center">
          <Plus size={18} />
          Add Customer Type
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mr-4"><Users size={24} /></div>
          <div><p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Types</p><h3 className="text-2xl font-bold text-gray-800">{totalCustomerTypes}</h3></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center">
          <div className="bg-green-100 p-3 rounded-lg text-green-600 mr-4"><Tag size={24} /></div>
          <div><p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Customers</p><h3 className="text-2xl font-bold text-gray-800">{totalCustomers}</h3></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center">
          <div className="bg-cyan-100 p-3 rounded-lg text-cyan-600 mr-4"><ToggleRight size={24} /></div>
          <div><p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Active Types</p><h3 className="text-2xl font-bold text-gray-800">{activeCustomerTypes}</h3></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center">
          <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600 mr-4"><ToggleLeft size={24} /></div>
          <div><p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Inactive Types</p><h3 className="text-2xl font-bold text-gray-800">{inactiveCustomerTypes}</h3></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <input
            type="text"
            placeholder="Search by name or description..."
            className="w-full sm:max-w-xs px-4 py-2 border rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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

        {/* Desktop View Table */}
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={filteredUnitList}
            progressPending={loading}
            pagination
            highlightOnHover
            responsive
            customStyles={{
              headRow: { style: { backgroundColor: '#f9fafb', fontWeight: 'bold', color: '#374151' } },
              cells: { style: { padding: '12px 16px' } }
            }}
          />
        </div>

        {/* Mobile View Cards */}
        <div className="block md:hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredUnitList.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No customer types found</div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredUnitList.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 border-l-4 border-l-green-500 rounded-lg shadow-sm p-4 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow pr-8">
                      <h6 className="font-bold text-blue-600 mb-1">{item.name}</h6>
                      <p className="text-gray-500 text-sm mb-2">{item.description || "-"}</p>
                      <div className="flex flex-wrap gap-2 items-center mt-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                        {item.discountPercentage > 0 && (
                          <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-yellow-100 text-yellow-800">
                            {item.discountPercentage}% Discount
                          </span>
                        )}
                        <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-blue-100 text-blue-800">
                          {item.totalCustomers} Customers
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button 
                        onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {openDropdownId === item.id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-10 py-1">
                          <button 
                            onClick={() => { handleEdit(item); setOpenDropdownId(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button 
                            onClick={() => { handleDeleteClick(item); setOpenDropdownId(null); }}
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

      <CustomerTypeForm
        modal={addModal}
        toggleModal={() => { setAddModal(false); setSelectedUnit(null); }}
        selectedUnit={selectedUnit}
        fetchUnit={fetchUnitList}
      />

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
    </div>
  );
}
