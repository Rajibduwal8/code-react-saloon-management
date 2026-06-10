import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;
const BASE = "/customer-appointments";

const AppointmentService = {
  getList: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.from) query.append("from", params.from);
    if (params.to) query.append("to", params.to);

    const qs = query.toString();
    const response = await apiService.get(`${BASE}${qs ? `?${qs}` : ""}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiService.get(`${BASE}/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiService.post(BASE, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiService.put(`${BASE}/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiService.delete(`${BASE}/${id}`);
    return response.data;
  },

  complete: async (id, data) => {
    const response = await apiService.post(`${BASE}/${id}/complete`, data);
    return response.data;
  },
};

export default AppointmentService;
