import _BaseAPIService from "./_BaseAPIService";

const apiService = _BaseAPIService.instance;

export const getProducts = async (page = 1, pageSize = 12) => {
  const response = await apiService.get(`/products?Page=${page}&PageSize=${pageSize}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiService.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await apiService.post("/products", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await apiService.put(`/products/${id}`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await apiService.delete(`/products/${id}`);
  return response.data;
};
