import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DailyLogService, {
  type CreateDailyLogData,
  type DailyLogFilters,
} from "../services/dailyLogService";

// Query Keys
export const dailyLogKeys = {
  all: ["dailyLogs"] as const,
  lists: () => [...dailyLogKeys.all, "list"] as const,
  list: (filters: DailyLogFilters) =>
    [...dailyLogKeys.lists(), filters] as const,
  details: () => [...dailyLogKeys.all, "detail"] as const,
  detail: (id: string) => [...dailyLogKeys.details(), id] as const,
  byHouse: (houseId: string) =>
    [...dailyLogKeys.all, "byHouse", houseId] as const,
  byDateRange: (startDate: string, endDate: string) =>
    [...dailyLogKeys.all, "dateRange", startDate, endDate] as const,
};

// Hooks
export function useDailyLogs(filters: DailyLogFilters = {}) {
  return useQuery({
    queryKey: dailyLogKeys.list(filters),
    queryFn: () => DailyLogService.getDailyLogs(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDailyLog(id: string) {
  return useQuery({
    queryKey: dailyLogKeys.detail(id),
    queryFn: () => DailyLogService.getDailyLogById(id),
    enabled: !!id,
  });
}

export function useDailyLogsByHouse(
  houseId: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: dailyLogKeys.byHouse(houseId),
    queryFn: () =>
      DailyLogService.getDailyLogsByHouse(houseId, startDate, endDate),
    enabled: !!houseId,
  });
}

export function useDailyLogsByDateRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: dailyLogKeys.byDateRange(startDate, endDate),
    queryFn: () => DailyLogService.getDailyLogsByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useCreateDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDailyLogData) =>
      DailyLogService.createDailyLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.all });
    },
  });
}

export function useUpdateDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateDailyLogData>;
    }) => DailyLogService.updateDailyLog(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.lists() });
    },
  });
}

export function useDeleteDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DailyLogService.deleteDailyLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.all });
    },
  });
}
