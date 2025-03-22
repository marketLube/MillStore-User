import apiClient from "../client";

const userService = {
  updateUser: async (user) => {
    const response = await apiClient.patch("/user/update-user", user);
    return response.data;
  },
};

export default userService;
