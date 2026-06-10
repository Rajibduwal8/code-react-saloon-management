import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const UnitsService = {
  getList: async () => {
    const response = await apiService.get("/units");
    return response.data;
  },

  getById: async (id) => {
    const response = await apiService.get(`/units/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiService.post("/units", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiService.put(`/units/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiService.delete(`/units/${id}`);
    return response.data;
  },
};

export default UnitsService;
