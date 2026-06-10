import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const ProductService = {
  getList: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.Name) query.append("Name", params.Name);
    if (params.Page) query.append("Page", params.Page);
    if (params.PageSize) query.append("PageSize", params.PageSize);
    if (params.CategoryId) query.append("CategoryId", params.CategoryId);
    if (params.PriceMin !== undefined) query.append("PriceMin", params.PriceMin);
    if (params.PriceMax !== undefined) query.append("PriceMax", params.PriceMax);
    if (params.FetchHidden !== undefined) query.append("FetchHidden", params.FetchHidden);
    if (params.ShowInOrder !== undefined) query.append("ShowInOrder", params.ShowInOrder);

    const qs = query.toString();
    const response = await apiService.get(`/products${qs ? `?${qs}` : ""}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiService.get(`/products/${id}`);
    return response.data;
  },

  /**
   * POST /api/products — multipart/form-data
   * data: object with fields, imageFile: File|null
   */
  create: async (data, imageFile = null) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    if (imageFile) formData.append("Image", imageFile);
    const response = await apiService.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * PUT /api/products/{id} — multipart/form-data
   */
  update: async (id, data, imageFile = null) => {
    const formData = new FormData();
    formData.append("Id", id);
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    if (imageFile) formData.append("Image", imageFile);
    const response = await apiService.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await apiService.delete(`/products/${id}`);
    return response.data;
  },
};

export default ProductService;
