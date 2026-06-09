import AuthenticationsServices from "@/src/services/AuthenticationService/AuthenticationsServices";
import _BaseAPIService from "@/src/services/_BaseAPIService";

export const handleLogout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedOutlet");
    window.location.href = "/login";
  }
};

export const refreshToken = async () => {
  try {
    const token = _BaseAPIService.retrieveToken();
    if (!token) return null;

    const response = await AuthenticationsServices.refresh({ token });
    
    if (response) {
      _BaseAPIService.storeToken(response.token || response.accessToken);
      return response;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    handleLogout();
  }
  return null;
};
