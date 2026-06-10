import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const CustomerMetaFieldService = {
  getList: async () => {
    // Assuming endpoint is /customermetafield, update if different
    const response = await apiService.get("/customer-meta-fields");
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiService.get(`/customer-meta-fields/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiService.post("/customer-meta-fields", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiService.put(`/customer-meta-fields`, { id, ...data });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/customer-meta-fields/${id}`);
    return response.data;
  },
};

export default CustomerMetaFieldService;
