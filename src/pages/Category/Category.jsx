import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Plus, Edit2, Trash2, MoreVertical, Tag, Eye, EyeOff, ToggleRight, ToggleLeft } from "lucide-react";
import CategoryService from "../../services/OrderingServices/CategoryService";
import CategoryForm from "./component/CategoryForm";
import DeleteModal from "../../components/common/DeleteModal";
import toast from "react-hot-toast";

export default function Category() {
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Pagination
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");

  const fetchList = async (page = currentPage, size = perPage, search = searchText) => {
    try {
      setLoading(true);
      const response = await CategoryService.getList({ Page: page, PageSize: size, SearchText: search });
      setCategoryList(response?.items || []);
      setTotalRows(response?.totalCount || 0);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage]);

  useEffect(() => {
    const timer = setTimeout(() => fetchList(1, perPage, searchText), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const handleAdd = () => { setSelectedItem(null); setAddModal(true); };
  const handleEdit = (item) => { setSelectedItem(item); setAddModal(true); };
  const handleDeleteClick = (item) => { setSelectedItem(item); setDeleteModal(true); };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await CategoryService.delete(selectedItem.id);
      toast.success("Category deleted successfully");
      fetchList();
      setDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const columns = [
    {
      name: "S.N",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "65px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => <span className="font-medium text-gray-800">{row.name}</span>,
    },
    {
      name: "Parent",
      selector: (row) => row.parentName || "—",
      sortable: true,
    },
    {
      name: "Cost Center",
      selector: (row) => row.costCenterName || "—",
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      name: "Visibility",
      cell: (row) => (
        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${row.isHidden ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>
          {row.isHidden ? "Hidden" : "Visible"}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit(row)} className="text-blue-500 hover:text-blue-700 transition-colors" title="Edit">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDeleteClick(row)} className="text-red-500 hover:text-red-700 transition-colors" title="Delete">
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
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage product and service categories</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors w-full md:w-auto justify-center"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full sm:max-w-xs px-4 py-2 border rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={categoryList}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={(page) => setCurrentPage(page)}
            onChangeRowsPerPage={(newSize, page) => { setPerPage(newSize); setCurrentPage(page); }}
            highlightOnHover
            responsive
            customStyles={{
              headRow: { style: { backgroundColor: "#f9fafb", fontWeight: "bold", color: "#374151" } },
              cells: { style: { padding: "12px 16px" } },
            }}
          />
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : categoryList.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No categories found</div>
          ) : (
            <div className="p-4 space-y-3">
              {categoryList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 border-l-4 border-l-blue-500 rounded-lg shadow-sm p-4 relative"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow pr-10">
                      <h6 className="font-bold text-blue-600 mb-1">{item.name}</h6>
                      {item.parentName && (
                        <p className="text-gray-500 text-sm mb-1">
                          <span className="font-medium">Parent:</span> {item.parentName}
                        </p>
                      )}
                      {item.costCenterName && (
                        <p className="text-gray-500 text-sm mb-2">
                          <span className="font-medium">Cost Center:</span> {item.costCenterName}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.isHidden ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>
                          {item.isHidden ? "Hidden" : "Visible"}
                        </span>
                      </div>
                    </div>
                    {/* Dropdown menu */}
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

      <CategoryForm
        modal={addModal}
        toggleModal={() => { setAddModal(false); setSelectedItem(null); }}
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
