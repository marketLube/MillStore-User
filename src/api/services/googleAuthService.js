import apiClient from "../client";

export const googleAuthService = {
  googleLogin: async (accessToken, userInfo) => {
    const response = await apiClient.post("/user/google-login", {
      accessToken,
      userInfo,
    });
    return response.data;
  },
};
