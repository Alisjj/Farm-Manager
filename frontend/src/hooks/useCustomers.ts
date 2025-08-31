import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CustomerService, {
  type CreateCustomerData,
  type CustomerFilters,
} from "../services/customerService";

// Query Keys
export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters: CustomerFilters) =>
    [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  active: () => [...customerKeys.all, "active"] as const,
  summary: () => [...customerKeys.all, "summary"] as const,
  search: (query: string) => [...customerKeys.all, "search", query] as const,
  salesHistory: (id: string) =>
    [...customerKeys.all, "salesHistory", id] as const,
};

// Hooks
export function useCustomers(filters: CustomerFilters = {}) {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => CustomerService.getCustomers(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => CustomerService.getCustomerById(id),
    enabled: !!id,
  });
}

export function useActiveCustomers() {
  return useQuery({
    queryKey: customerKeys.active(),
    queryFn: () => CustomerService.getActiveCustomers(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCustomerSummary() {
  return useQuery({
    queryKey: customerKeys.summary(),
    queryFn: () => CustomerService.getCustomerSummary(),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function useSearchCustomers(query: string) {
  return useQuery({
    queryKey: customerKeys.search(query),
    queryFn: () => CustomerService.searchCustomers(query),
    enabled: !!query && query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCustomerSalesHistory(
  id: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: customerKeys.salesHistory(id),
    queryFn: () =>
      CustomerService.getCustomerSalesHistory(id, startDate, endDate),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerData) =>
      CustomerService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateCustomerData>;
    }) => CustomerService.updateCustomer(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CustomerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

export function useActivateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CustomerService.activateCustomer(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.active() });
    },
  });
}

export function useDeactivateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CustomerService.deactivateCustomer(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.active() });
    },
  });
}

export function useUpdateCustomerBalance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      amount,
      operation,
    }: {
      id: string;
      amount: number;
      operation: "add" | "subtract" | "set";
    }) => CustomerService.updateCustomerBalance(id, amount, operation),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.summary() });
    },
  });
}
