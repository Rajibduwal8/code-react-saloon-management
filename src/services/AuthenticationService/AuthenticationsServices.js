import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const AuthenticationsServices = {
  login: async (data) => {
    try {
      const response = await apiService.post("/auth/login", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (changeData) => {
    try {
      const response = await apiService.put(
        "/user/change-password",
        changeData
      );
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw new Error("Failed to change password. Please try again.");
    }
  },

  updatePassword: async (payload) => {
    // payload: { oldPassword, newPassword, confirmPassword }
    const response = await apiService.post("/auth/change-password", payload);
    return response.data;
  },

  orgRegister: async (payload) => {
    try {
      const response = await apiService.post(
        "/registration/register-org",
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw new Error("Registration Failed. Please try again.");
    }
  },

  resetPassword: async (resetCode, newPassword, confirmPassword) => {
    const payload = {
      reset_password_code: resetCode,
      password: newPassword,
      password_confirmation: confirmPassword,
    };
    const response = await apiService.post("/users/reset-password", payload);
    return response.data;
  },

  forgetPassword: async (data) => {
    const payload = { email: data };
    const response = await apiService.post("/users/forgot-password", payload);
    return response.data;
  },

  userRole: async () => {
    const response = await apiService.get(`/auth/roles`);
    return response.data;
  },
  
  userRoleManage: async (resetData) => {
    const response = await apiService.get(`/auth/get-users`);
    return response.data;
  },

  viewdata: async (userId) => {
    const response = await apiService.get(`/auth/get-user/${userId}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiService.delete(`/auth/${id}`);
    return response.data;
  },
  
  updateregister: async (id, updatedData) => {
    const response = await apiService.put(`/auth/${id}`, updatedData);
    return response.data;
  },

  refresh: async (data) => {
    const response = await apiService.post("/refresh", data);
    return response.data;
  },
};

export default AuthenticationsServices;
