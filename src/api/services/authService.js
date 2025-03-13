import apiClient from "../client";

export const loginService = {
  login: async (email, password) => {
    const response = await apiClient.post("/user/login", { email, password });
    return response.data;
  },
};
