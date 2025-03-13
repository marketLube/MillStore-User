import { useQuery } from "@tanstack/react-query";
import { productService } from "../../api/services/productService";
import apiClient from "../../api/client";

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    retry: 1,
    retryDelay: 1000,
  });
}

async function getProducts(filters) {
  const params = new URLSearchParams();

  if (filters.categoryId) params.append("categoryId", filters.categoryId);
  if (filters.subcategoryId)
    params.append("subcategoryId", filters.subcategoryId);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
  if (filters.labelId) params.append("labelId", filters.labelId);

  if (filters.sort) {
    switch (filters.sort) {
      case "newest":
        params.append("sort", "-createdAt");
        break;
      case "price-low":
        params.append("sort", "price");
        break;
      case "price-high":
        params.append("sort", "-price");
        break;
      default:
        params.append("sort", "-createdAt");
    }
  }

  try {
    const url = `/product/get-products?${params.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    if (error.response?.status === 500) {
      throw new Error(
        "Server error while fetching products. Please try again later."
      );
    }
    throw error;
  }
}

export const useProductById = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id),
  });
};
