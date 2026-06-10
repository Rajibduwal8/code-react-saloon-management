import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const CustomerService = {
  getList: async (params = {}) => {
    // Expected params: Search, IsActive, Page, PageSize
    const query = new URLSearchParams();
    
    if (params.Search) query.append("Search", params.Search);
    if (params.IsActive !== undefined) query.append("IsActive", params.IsActive);
    if (params.Page) query.append("Page", params.Page);
    if (params.PageSize) query.append("PageSize", params.PageSize);
    
    const queryString = query.toString();
    const url = `/customer${queryString ? `?${queryString}` : ""}`;
    
    const response = await apiService.get(url);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiService.get(`/customer/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await apiService.post("/customer", data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await apiService.put(`/customer/update/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiService.delete(`/customer/${id}`);
    return response.data;
  },
};

export default CustomerService;
