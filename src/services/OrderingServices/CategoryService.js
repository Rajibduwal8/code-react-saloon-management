import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const CategoryService = {
  getList: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.Page) query.append("Page", params.Page);
    if (params.PageSize) query.append("PageSize", params.PageSize);
    if (params.Name) query.append("Name", params.Name);
    if (params.SearchText) query.append("SearchText", params.SearchText);
    if (params.IsActive !== undefined) query.append("IsActive", params.IsActive);
    if (params.IsHidden !== undefined) query.append("IsHidden", params.IsHidden);
    if (params.ShowInOrder !== undefined) query.append("ShowInOrder", params.ShowInOrder);

    const queryString = query.toString();
    const url = `/category${queryString ? `?${queryString}` : ""}`;
    const response = await apiService.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiService.get(`/category/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiService.post("/category", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiService.put(`/category/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiService.delete(`/category/${id}`);
    return response.data;
  },
};

export default CategoryService;
