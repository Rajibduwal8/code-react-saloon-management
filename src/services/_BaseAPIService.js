import axios from "axios";
import toast from "react-hot-toast";

// Routes that do not require outlet/cost-center context headers.
// The Authorization header is still omitted automatically when no token exists.
const PUBLIC_PATHS = [
  "/users/forgot-password",
  "/users/reset-password",
  "/registration/register-org",
  "/refresh",
];

const _BaseAPIService = {
  retrieveToken: () => {
    try {
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString);
      return user?.accessToken || null;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  },

  storeToken: (token) => {
    try {
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString) || {};
      user.accessToken = token;
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error storing token:", error);
    }
  },

};

// Axios instance
_BaseAPIService.instance = axios.create({
  baseURL: window.APP_CONFIG.api1.baseapi,
});

// Attach token, tenantOutletId and tenantCostCenterId to every authenticated request
_BaseAPIService.instance.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    const token = _BaseAPIService.retrieveToken();

    // Always attach the bearer token when available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Skip outlet/cost-center context headers for public (unauthenticated) endpoints
    const isPublicPath = PUBLIC_PATHS.some((path) =>
      config.url?.startsWith(path)
    );
    if (isPublicPath) {
      return config;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const outletData = JSON.parse(
      localStorage.getItem("selectedOutlet") || "null"
    );

    // tenantOutletId: prefer value stored directly on user (from login response),
    // fall back to the id of the currently selected outlet stored in localStorage.
    const tenantOutletId = user?.tenantOutletId ?? outletData?.id;
    if (tenantOutletId) {
      config.headers["tenantOutletId"] = tenantOutletId;
    }

    // tenantCostCenterId: prefer value stored directly on user (from login response),
    // fall back to the costCenterId of the currently selected outlet.
    const tenantCostCenterId =
      user?.tenantCostCenterId ?? outletData?.costCenterId;
    if (tenantCostCenterId) {
      config.headers["tenantCostCenterId"] = tenantCostCenterId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors and redirect to login

_BaseAPIService.instance.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      console.warn("Unauthorized, redirecting to login...");
      localStorage.removeItem("user"); // Clear token
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default _BaseAPIService;
