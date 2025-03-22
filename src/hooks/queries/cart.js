import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cartService from "../../api/services/cartService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Get cart items
export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
  });
};

// Add to cart mutation
export const useAddToCart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, variantId, quantity }) =>
      cartService.addToCart(productId, variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Item added to cart");
    },
    onError: (error) => {
      if (error.status === 401) {
        toast.error("Please login to add item to cart");
        navigate("/login", { state: { from: location.pathname } });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to add item to cart"
        );
      }
    },
  });
};

// Update quantity mutation
export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, variantId, action }) =>
      cartService.updateQuantity(productId, variantId, action),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update cart");
    },
  });
};

// Remove from cart mutation
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, variantId }) =>
      cartService.removeFromCart(productId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Item removed from cart");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to remove item from cart"
      );
    },
  });
};

// Clear cart mutation
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Cart cleared");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to clear cart");
    },
  });
};
