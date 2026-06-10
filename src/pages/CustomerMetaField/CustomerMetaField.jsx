import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Plus, MoreVertical, Edit2, Trash2, List } from "lucide-react";
import CustomerMetaFieldService from "../../services/OrderingServices/CustomerMetaFieldService";
import CustomerMetaFieldForm from "./component/CustomerMetaFieldForm";
import DeleteModal from "../../components/common/DeleteModal";

export default function CustomerMetaField() {
  const [unitList, setUnitList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const fetchUnitList = async () => {
    try {
      setLoading(true);
      const response = await CustomerMetaFieldService.getList();
      // Adjust if the API returns direct array or object with items
      setUnitList(Array.isArray(response) ? response : response?.items || []);
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
        await CustomerMetaFieldService.delete(selectedUnit.id);
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
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Type",
      selector: (row) => row.type || "text",
      sortable: true,
    },
    {
      name: "Required",
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${row.isRequired ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
          {row.isRequired ? "Yes" : "No"}
        </span>
      ),
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
    const matchSearch = !searchQuery || unit.title?.toLowerCase().includes(searchQuery.toLowerCase()) || unit.code?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="p-4 md:p-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Metafields</h1>
          <p className="text-gray-500 text-sm mt-1">Manage dynamic attributes for your customers</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors w-full md:w-auto justify-center">
          <Plus size={18} />
          Add Metafield
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <input
            type="text"
            placeholder="Search by title or code..."
            className="w-full sm:max-w-xs px-4 py-2 border rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
            <div className="p-8 text-center text-gray-500">No customer metafields found</div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredUnitList.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 border-l-4 border-l-blue-500 rounded-lg shadow-sm p-4 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow pr-8">
                      <h6 className="font-bold text-blue-600 mb-1">{item.title} ({item.code})</h6>
                      <p className="text-gray-500 text-sm mb-2">Type: {item.type || "text"}</p>
                      <div className="flex flex-wrap gap-2 items-center mt-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                        {item.isRequired && (
                          <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-yellow-100 text-yellow-800">
                            Required
                          </span>
                        )}
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

      <CustomerMetaFieldForm
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
