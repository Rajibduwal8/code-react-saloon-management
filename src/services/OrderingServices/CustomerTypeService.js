import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const CustomerTypeService = {
  getList: async () => {
    const response = await apiService.get("/customertype");
    return response.data;
  },
  getById: async (id) => {
    const response = await apiService.get(`/customertype/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiService.post("/customertype", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiService.put(`/customertype`, { id, ...data });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/customertype/${id}`);
    return response.data;
  },
};

export default CustomerTypeService;
