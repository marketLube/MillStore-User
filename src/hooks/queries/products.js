import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "../../api/services/productService";
import apiClient from "../../api/client";

export function useProducts(filters = {}) {
  return useInfiniteQuery({
    queryKey: ["products", filters],
    queryFn: ({ pageParam = 1 }) => getProducts({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.hasMore
        ? lastPage.data.currentPage + 1
        : undefined;
    },
    retry: 1,
    retryDelay: 1000,
  });
}

async function getProducts(filters) {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", filters.page);
  if (filters.limit) params.append("limit", filters.limit);

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
        params.append("sort", "price-low");
        break;
      case "price-high":
        params.append("sort", "price-high");
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
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id),
  });
  return { data, isLoading, error, refetch };
};

export const useSearchProducts = (searchQuery) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products", searchQuery],
    queryFn: () => getProductsBySearch(searchQuery),
  });
  return { data, isLoading, error, refetch };
};

async function getProductsBySearch(searchQuery) {
  try {
    const url = `/product/search?keyword=${searchQuery}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

