import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "../../api/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser, setIsLoggedIn } from "../../redux/features/user/userSlice";
export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (data) => {
      localStorage.setItem("user-auth-token", data.token);
      dispatch(setUser(data.user));
      dispatch(setIsLoggedIn(true));
      navigate("/");
    },
    onError: (error) => {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to login");
    },
  });
};

export const useCheckAuth = () => {
  return useQuery({
    queryKey: ["check-auth"],
    queryFn: () => authService.checkAuth(),
    retry: 1,
    onError: (error) => {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to check auth");
    },
  });
};
