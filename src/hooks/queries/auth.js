import { useMutation } from "@tanstack/react-query";
import { loginService } from "../../api/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ email, password }) => loginService.login(email, password),
    onSuccess: (data) => {
      console.log("data", data);
      localStorage.setItem("user-auth-token", data.token);
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to login");
    },
  });
};
