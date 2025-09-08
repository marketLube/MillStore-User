import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cartService from "../../api/services/cartService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { storeRedirectPath } from "../../utils/redirectUtils";
import { useDispatch } from "react-redux";
import { setCart } from "../../redux/features/cart/cartSlice";
import { useEffect } from "react";

// Guest cart helpers
const GUEST_CART_KEY = "guest-cart";

const readGuestCartItems = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeGuestCartItems = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  // Hint react-query to refetch
  window.dispatchEvent(new CustomEvent("guest-cart-updated"));
};

// Merge guest cart into server cart after login
export const mergeGuestCartToServer = async () => {
  const token = localStorage.getItem("user-auth-token");
  if (!token) return;
  
  const guestItems = readGuestCartItems();
  if (guestItems.length === 0) return;
  
  try {
    // Add each guest item to server cart
    for (const item of guestItems) {
      await cartService.addToCart(
        item.product._id,
        item.variant?._id || null,
        item.quantity
      );
    }
    // Clear guest cart after successful merge
    writeGuestCartItems([]);
    console.log("Guest cart merged to server successfully");
  } catch (error) {
    console.error("Failed to merge guest cart:", error);
  }
};

const buildFormattedCartFromGuest = (items) => {
  const normalizedItems = items.map((it) => ({
    product: it.product,
    variant: it.variant || null,
    quantity: it.quantity || 1,
    offerPrice: it.offerPrice,
  }));
  const subTotal = normalizedItems.reduce(
    (sum, it) => sum + (Number(it.offerPrice) || 0) * (it.quantity || 1),
    0
  );
  const totalPrice = subTotal;
  return {
    data: {
      formattedCart: {
        items: normalizedItems,
        subTotal,
        totalPrice,
      },
      couponDetails: null,
      deliveryCharges: 0,
      finalAmount: totalPrice,
    },
    success: true,
  };
};

// Get cart items
export const useCart = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("user-auth-token");

  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (token) {
        return await cartService.getCart();
      }
      const guestItems = readGuestCartItems();
      return buildFormattedCartFromGuest(guestItems);
    },
  });

  useEffect(() => {
    if (data?.data?.formattedCart) {
      dispatch(setCart(data.data.formattedCart));
    }
  }, [data, dispatch]);

  // Keep guest cart reactive across tabs and local changes
  useEffect(() => {
    if (!token) {
      const onStorage = (e) => {
        if (e.key === GUEST_CART_KEY) {
          dispatch(setCart(buildFormattedCartFromGuest(readGuestCartItems()).data.formattedCart));
        }
      };
      const onCustom = () => {
        dispatch(setCart(buildFormattedCartFromGuest(readGuestCartItems()).data.formattedCart));
      };
      window.addEventListener("storage", onStorage);
      window.addEventListener("guest-cart-updated", onCustom);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("guest-cart-updated", onCustom);
      };
    }
  }, [dispatch, token]);

  return { data, isLoading: !!token ? isLoading : false, error: token ? error : null };
};

// Add to cart mutation
export const useAddToCart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ productId, variantId, quantity, productData, variantData }) => {
      const token = localStorage.getItem("user-auth-token");
      if (token) {
        return await cartService.addToCart(productId, variantId, quantity);
      }
      // Guest mode: write to localStorage
      const items = readGuestCartItems();
      const index = items.findIndex(
        (it) => it.product?._id === productId && (it.variant?._id || null) === (variantId || null)
      );
      if (index >= 0) {
        items[index].quantity = (items[index].quantity || 1) + (quantity || 1);
      } else {
        const offerPrice = variantData?.offerPrice ?? productData?.offerPrice ?? 0;
        const product = productData
          ? {
              _id: productData._id,
              name: productData.name,
              mainImage: productData.mainImage,
              stock: productData.stock,
            }
          : { _id: productId };
        const variant = variantId
          ? {
              _id: variantId,
              offerPrice: variantData?.offerPrice ?? offerPrice,
            }
          : null;
        items.push({ product, variant, quantity: quantity || 1, offerPrice });
      }
      writeGuestCartItems(items);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Item added to cart");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add item to cart");
    },
  });

  return { mutate, isLoading };
};

// Update quantity mutation
export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, variantId, action }) => {
      const token = localStorage.getItem("user-auth-token");
      if (token) {
        return await cartService.updateQuantity(productId, variantId, action);
      }
      const items = readGuestCartItems();
      const index = items.findIndex(
        (it) => it.product?._id === productId && (it.variant?._id || null) === (variantId || null)
      );
      if (index >= 0) {
        const delta = action === "increment" ? 1 : -1;
        const nextQty = (items[index].quantity || 1) + delta;
        if (nextQty <= 0) {
          items.splice(index, 1);
        } else {
          items[index].quantity = nextQty;
        }
        writeGuestCartItems(items);
      }
      return { success: true };
    },
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
    mutationFn: async ({ productId, variantId }) => {
      const token = localStorage.getItem("user-auth-token");
      if (token) {
        return await cartService.removeFromCart(productId, variantId);
      }
      const items = readGuestCartItems().filter(
        (it) => !(it.product?._id === productId && (it.variant?._id || null) === (variantId || null))
      );
      writeGuestCartItems(items);
      return { success: true };
    },
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
    mutationFn: async () => {
      const token = localStorage.getItem("user-auth-token");
      if (token) {
        return await cartService.clearCart();
      }
      writeGuestCartItems([]);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Cart cleared");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to clear cart");
    },
  });
};
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import cartService from "../../api/services/cartService";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setCart } from "../../redux/features/cart/cartSlice";

// // Get cart items
// export const useCart = () => {
//   const dispatch = useDispatch();
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["cart"],
//     queryFn: cartService.getCart,
//   });

//   dispatch(setCart(data?.data?.formattedCart));

//   return { data, isLoading, error };
// };

// // Add to cart mutation
// export const useAddToCart = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const { mutate, isLoading } = useMutation({
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
//   return { mutate, isLoading };
// };

// // Update quantity mutation
// export const useUpdateCartQuantity = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ productId, variantId, action }) =>
//       cartService.updateQuantity(productId, variantId, action),
//     onMutate: ({ productId, variantId, action }) => {
//       // Get current cart data
//       const cart = queryClient.getQueryData(["cart"]);
//       if (!cart) return;

//       // Create new cart with updated quantity
//       const newCart = structuredClone(cart);
//       const item = newCart.data.formattedCart.items.find(
//         (item) => item.product._id === productId
//       );

//       if (item) {
//         // Update item quantity
//         item.quantity += action === "increment" ? 1 : -1;

//         // Recalculate total price
//         newCart.data.formattedCart.totalPrice =
//           newCart.data.formattedCart.items.reduce(
//             (total, item) => total + item.offerPrice * item.quantity,
//             0
//           );

//         // Update final amount if no coupon is applied
//         if (!newCart.data.couponDetails) {
//           newCart.data.finalAmount = newCart.data.formattedCart.totalPrice;
//         }
//       }

//       // Update cart immediately
//       queryClient.setQueryData(["cart"], newCart);
//     },
//     onError: () => {
//       // Refresh cart data on error
//       queryClient.invalidateQueries(["cart"]);
//       toast.error("Failed to update cart");
//     },
//   });
// };

// // Remove from cart mutation
// export const useRemoveFromCart = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ productId, variantId }) =>
//       cartService.removeFromCart(productId, variantId),
//     onMutate: ({ productId }) => {
//       // Get current cart data
//       const cart = queryClient.getQueryData(["cart"]);
//       if (!cart) return;

//       // Create new cart without the removed item
//       const newCart = structuredClone(cart);
//       newCart.data.formattedCart.items =
//         newCart.data.formattedCart.items.filter(
//           (item) => item.product._id !== productId
//         );

//       // Recalculate total price after removing item
//       newCart.data.formattedCart.totalPrice =
//         newCart.data.formattedCart.items.reduce(
//           (total, item) => total + item.offerPrice * item.quantity,
//           0
//         );

//       // Update final amount if no coupon is applied
//       if (!newCart.data.couponDetails) {
//         newCart.data.finalAmount = newCart.data.formattedCart.totalPrice;
//       }

//       // Update cart immediately
//       queryClient.setQueryData(["cart"], newCart);
//     },
//     onError: () => {
//       // Refresh cart data on error
//       queryClient.invalidateQueries(["cart"]);
//       toast.error("Failed to remove item");
//     },
//     onSuccess: () => {
//       toast.success("Item removed from cart");
//     },
//   });
// };

// // Clear cart mutation
// export const useClearCart = () => {
//   const queryClient = useQueryClient();

//   const { mutate, isLoading } = useMutation({
//     mutationFn: cartService.clearCart,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["cart"]);
//       toast.success("Cart cleared");
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Failed to clear cart");
//     },
//   });
//   return { mutate, isLoading };
// };

// export const refetchCart = () => {
//   const queryClient = useQueryClient();
//   queryClient.invalidateQueries(["cart"]);
// };