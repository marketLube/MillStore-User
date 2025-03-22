import { useMutation, useQuery } from "@tanstack/react-query";
import orderService from "../../api/services/orderServices";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const usePlaceOrder = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (address) => orderService.placeOrder(address),
    onSuccess: () => {
      toast.success("Order placed successfully");
      navigate("/profile");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to place order");
    },
  });
};

export const useGetOrderHistory = () => {
  return useQuery({
    queryKey: ["order-history"],
    queryFn: () => orderService.getOrderHistory(),
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to get order history"
      );
    },
  });
};
