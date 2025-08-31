import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SalesService, {
  type CreateSaleData,
  type SaleFilters,
} from "../services/salesService";

// Query Keys
export const salesKeys = {
  all: ["sales"] as const,
  lists: () => [...salesKeys.all, "list"] as const,
  list: (filters: SaleFilters) => [...salesKeys.lists(), filters] as const,
  details: () => [...salesKeys.all, "detail"] as const,
  detail: (id: string) => [...salesKeys.details(), id] as const,
  analytics: (startDate?: string, endDate?: string) =>
    [...salesKeys.all, "analytics", startDate, endDate] as const,
  byCustomer: (customerId: string) =>
    [...salesKeys.all, "byCustomer", customerId] as const,
  pending: () => [...salesKeys.all, "pending"] as const,
};

// Hooks
export function useSales(filters: SaleFilters = {}) {
  return useQuery({
    queryKey: salesKeys.list(filters),
    queryFn: () => SalesService.getSales(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSale(id: string) {
  return useQuery({
    queryKey: salesKeys.detail(id),
    queryFn: () => SalesService.getSaleById(id),
    enabled: !!id,
  });
}

export function useSalesAnalytics(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: salesKeys.analytics(startDate, endDate),
    queryFn: () => SalesService.getSalesAnalytics(startDate, endDate),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useSalesByCustomer(
  customerId: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: salesKeys.byCustomer(customerId),
    queryFn: () =>
      SalesService.getSalesByCustomer(customerId, startDate, endDate),
    enabled: !!customerId,
  });
}

export function usePendingPayments() {
  return useQuery({
    queryKey: salesKeys.pending(),
    queryFn: () => SalesService.getPendingPayments(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSaleData) => SalesService.createSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesKeys.all });
    },
  });
}

export function useUpdateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSaleData> }) =>
      SalesService.updateSale(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      paymentStatus,
      paymentMethod,
    }: {
      id: string;
      paymentStatus: "pending" | "paid" | "overdue";
      paymentMethod?: string;
    }) => SalesService.updatePaymentStatus(id, paymentStatus, paymentMethod),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: salesKeys.pending() });
    },
  });
}

export function useDeleteSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SalesService.deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesKeys.all });
    },
  });
}
