import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cartService from "../../api/services/cartService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { storeRedirectPath } from "../../utils/redirectUtils";
import { useDispatch } from "react-redux";
import { setCart } from "../../redux/features/cart/cartSlice";
import { useEffect, useMemo } from "react";
// LocalStorage guest cart helpers
const GUEST_CART_KEY = "guest-cart";

const readGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return { items: [], subTotal: 0, totalPrice: 0 };
    const parsed = JSON.parse(raw);
    return {
      items: Array.isArray(parsed?.items) ? parsed.items : [],
      subTotal: Number(parsed?.subTotal) || 0,
      totalPrice: Number(parsed?.totalPrice) || 0,
    };
  } catch {
    return { items: [], subTotal: 0, totalPrice: 0 };
  }
};

const writeGuestCart = (cart) => {
  const safe = {
    items: cart.items || [],
    subTotal: Number(cart.subTotal) || 0,
    totalPrice: Number(cart.totalPrice) || 0,
  };
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(safe));
  return safe;
};

const buildCartDataEnvelope = (guestCart) => {
  const formattedCart = {
    items: guestCart.items,
    subTotal: guestCart.subTotal,
    totalPrice: guestCart.totalPrice,
  };
  return {
    data: {
      formattedCart,
      couponDetails: null,
      finalAmount: formattedCart.totalPrice,
      deliveryCharges: 0,
    },
  };
};

// Get cart items
export const useCart = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("user-auth-token");

  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: !!token, // Only run query if token exists
  });

  // Use useEffect to dispatch cart data only when it's available
  useEffect(() => {
    if (token) {
      if (data?.data?.formattedCart) {
        dispatch(setCart(data.data.formattedCart));
      }
    } else {
      const guest = readGuestCart();
      const envelope = buildCartDataEnvelope(guest);
      dispatch(setCart(envelope.data.formattedCart));
    }
  }, [data, dispatch]);

  if (!token) {
    // Build a synthetic response for guest carts with stable identity
    const guest = readGuestCart();
    const envelope = useMemo(
      () => buildCartDataEnvelope(guest),
      [JSON.stringify(guest)]
    );
    return { data: envelope, isLoading: false, error: null };
  }

  return { data, isLoading, error };
};

// Add to cart mutation
export const useAddToCart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const token = localStorage.getItem("user-auth-token");

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
        // Store current path before redirecting to login
        const redirectPath = window.location.pathname + window.location.search;
        storeRedirectPath(redirectPath);
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to add item to cart"
        );
      }
    },
  });

  const guestAdd = ({
    productId,
    variantId,
    quantity,
    productSnapshot,
    variantSnapshot,
  }) => {
    const guest = readGuestCart();
    const items = [...guest.items];
    const idx = items.findIndex(
      (it) =>
        it?.product?._id === productId &&
        (it?.variant?._id || null) === (variantId || null)
    );

    const unitOfferPrice =
      variantSnapshot?.offerPrice ?? productSnapshot?.offerPrice ?? 0;
    const unitStock = variantSnapshot?.stock ?? productSnapshot?.stock ?? 0;

    if (idx >= 0) {
      const existing = items[idx];
      const newQty = Math.min(
        (existing.quantity || 1) + (quantity || 1),
        unitStock || 9999
      );
      items[idx] = {
        ...existing,
        quantity: newQty,
      };
    } else {
      items.push({
        product: productSnapshot,
        variant: variantId ? variantSnapshot : null,
        quantity: quantity || 1,
        offerPrice: unitOfferPrice,
      });
    }

    const totalPrice = items.reduce(
      (sum, it) => sum + Number(it.offerPrice || 0) * Number(it.quantity || 0),
      0
    );
    const updated = writeGuestCart({ items, subTotal: totalPrice, totalPrice });
    dispatch(
      setCart({
        items: updated.items,
        subTotal: updated.subTotal,
        totalPrice: updated.totalPrice,
      })
    );
    toast.success("Item added to cart");
  };

  return {
    mutate: (payload, options) => {
      const tokenPresent = localStorage.getItem("user-auth-token");
      if (!tokenPresent) {
        try {
          guestAdd(payload);
          options?.onSuccess && options.onSuccess();
        } catch (e) {
          toast.error("Failed to add item to cart");
          options?.onError && options.onError(e);
        } finally {
          options?.onSettled && options.onSettled();
        }
        return;
      }
      return mutate(payload, options);
    },
    isLoading,
  };
};

// Update quantity mutation
export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const token = localStorage.getItem("user-auth-token");

  const authMutation = useMutation({
    mutationFn: ({ productId, variantId, action }) =>
      cartService.updateQuantity(productId, variantId, action),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update cart");
    },
  });

  const guestUpdate = ({ productId, variantId, action }) => {
    const guest = readGuestCart();
    let items = [...guest.items];
    const idx = items.findIndex(
      (it) =>
        it?.product?._id === productId &&
        (it?.variant?._id || null) === (variantId || null)
    );
    if (idx < 0) return;
    const current = items[idx];
    const unitStock = current?.variant?.stock ?? current?.product?.stock ?? 0;
    const nextQty =
      action === "increment"
        ? Math.min((current.quantity || 1) + 1, unitStock || 9999)
        : (current.quantity || 1) - 1;
    if (nextQty <= 0) {
      items = items.filter((_, i) => i !== idx);
    } else {
      items[idx] = { ...current, quantity: nextQty };
    }
    const totalPrice = items.reduce(
      (sum, it) => sum + Number(it.offerPrice || 0) * Number(it.quantity || 0),
      0
    );
    const updated = writeGuestCart({ items, subTotal: totalPrice, totalPrice });
    dispatch(setCart(updated));
  };

  return {
    mutate: (payload, options) => {
      const tokenPresent = localStorage.getItem("user-auth-token");
      if (!tokenPresent) {
        try {
          guestUpdate(payload);
          options?.onSuccess && options.onSuccess();
        } catch (e) {
          options?.onError && options.onError(e);
        } finally {
          options?.onSettled && options.onSettled();
        }
        return;
      }
      return authMutation.mutate(payload, options);
    },
    isPending: authMutation.isPending,
  };
};

// Remove from cart mutation
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const authMutation = useMutation({
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

  const guestRemove = ({ productId, variantId }) => {
    const guest = readGuestCart();
    const items = guest.items.filter(
      (it) =>
        !(
          it?.product?._id === productId &&
          (it?.variant?._id || null) === (variantId || null)
        )
    );
    const totalPrice = items.reduce(
      (sum, it) => sum + Number(it.offerPrice || 0) * Number(it.quantity || 0),
      0
    );
    const updated = writeGuestCart({ items, subTotal: totalPrice, totalPrice });
    dispatch(setCart(updated));
    toast.success("Item removed from cart");
  };

  return {
    mutate: (payload, options) => {
      const tokenPresent = localStorage.getItem("user-auth-token");
      if (!tokenPresent) {
        try {
          guestRemove(payload);
          options?.onSuccess && options.onSuccess();
        } catch (e) {
          options?.onError && options.onError(e);
        } finally {
          options?.onSettled && options.onSettled();
        }
        return;
      }
      return authMutation.mutate(payload, options);
    },
    isPending: authMutation.isPending,
  };
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
