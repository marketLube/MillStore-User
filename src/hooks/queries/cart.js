// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import cartService from "../../api/services/cartService";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// // Get cart items
// export const useCart = () => {
//   return useQuery({
//     queryKey: ["cart"],
//     queryFn: cartService.getCart,
//   });
// };

// // Add to cart mutation
// export const useAddToCart = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ productId, variantId, quantity }) =>
//       cartService.addToCart(productId, variantId, quantity),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["cart"]);
//       toast.success("Item added to cart");
//     },
//     onError: (error) => {
//       if (error.status === 401) {
//         toast.error("Please login to add item to cart");
//         navigate("/login", { state: { from: location.pathname } });
//       } else {
//         toast.error(
//           error.response?.data?.message || "Failed to add item to cart"
//         );
//       }
//     },
//   });
// };

// // Update quantity mutation
// export const useUpdateCartQuantity = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ productId, variantId, action }) =>
//       cartService.updateQuantity(productId, variantId, action),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["cart"]);
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Failed to update cart");
//     },
//   });
// };

// // Remove from cart mutation
// export const useRemoveFromCart = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ productId, variantId }) =>
//       cartService.removeFromCart(productId, variantId),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["cart"]);
//       toast.success("Item removed from cart");
//     },
//     onError: (error) => {
//       toast.error(
//         error.response?.data?.message || "Failed to remove item from cart"
//       );
//     },
//   });
// };

// // Clear cart mutation
// export const useClearCart = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: cartService.clearCart,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["cart"]);
//       toast.success("Cart cleared");
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Failed to clear cart");
//     },
//   });
// };
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cartService from "../../api/services/cartService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Get cart items
export const useCart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
  });
  return { data, isLoading, error };
};

// Add to cart mutation
export const useAddToCart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
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
  return { mutate, isLoading };
};

// Update quantity mutation
export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, variantId, action }) =>
      cartService.updateQuantity(productId, variantId, action),
    onMutate: ({ productId, variantId, action }) => {
      // Get current cart data
      const cart = queryClient.getQueryData(['cart']);
      if (!cart) return;

      // Create new cart with updated quantity
      const newCart = structuredClone(cart);
      const item = newCart.data.formattedCart.items.find(
        item => item.product._id === productId
      );

      if (item) {
        // Update item quantity
        item.quantity += action === 'increment' ? 1 : -1;

        // Recalculate total price
        newCart.data.formattedCart.totalPrice = newCart.data.formattedCart.items.reduce(
          (total, item) => total + (item.offerPrice * item.quantity),
          0
        );

        // Update final amount if no coupon is applied
        if (!newCart.data.couponDetails) {
          newCart.data.finalAmount = newCart.data.formattedCart.totalPrice;
        }
      }

      // Update cart immediately
      queryClient.setQueryData(['cart'], newCart);
    },
    onError: () => {
      // Refresh cart data on error
      queryClient.invalidateQueries(['cart']);
      toast.error("Failed to update cart");
    }
  });
};

// Remove from cart mutation
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, variantId }) =>
      cartService.removeFromCart(productId, variantId),
    onMutate: ({ productId }) => {
      // Get current cart data
      const cart = queryClient.getQueryData(['cart']);
      if (!cart) return;

      // Create new cart without the removed item
      const newCart = structuredClone(cart);
      newCart.data.formattedCart.items = newCart.data.formattedCart.items.filter(
        item => item.product._id !== productId
      );

      // Update cart immediately
      queryClient.setQueryData(['cart'], newCart);
    },
    onError: () => {
      // Refresh cart data on error
      queryClient.invalidateQueries(['cart']);
      toast.error("Failed to remove item");
    },
    onSuccess: () => {
      toast.success("Item removed from cart");
    }
  });
};

// Clear cart mutation
export const useClearCart = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Cart cleared");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to clear cart");
    },
  });
  return { mutate, isLoading };
};
