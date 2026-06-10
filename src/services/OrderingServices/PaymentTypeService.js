import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;
const BASE = "/paymenttypes";

const toFormData = (data) => {
  const formData = new FormData();
  const entries = {
    Code: data.Code ?? data.code,
    Name: data.Name ?? data.name,
    Description: data.Description ?? data.description ?? "",
    AccountNumber: data.AccountNumber ?? data.accountNumber ?? "",
    IsActive: data.IsActive ?? data.isActive ?? true,
  };
  Object.entries(entries).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value === true ? "true" : value === false ? "false" : value);
    }
  });
  return formData;
};

const PaymentTypeService = {
  getList: async () => {
    const response = await apiService.get(BASE);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiService.get(`${BASE}/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiService.post(BASE, toFormData(data), {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiService.put(`${BASE}/${id}`, toFormData(data), {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await apiService.delete(`${BASE}/${id}`);
    return response.data;
  },
};

export default PaymentTypeService;
