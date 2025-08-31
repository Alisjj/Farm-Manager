import { apiClient, type ApiResponse, type PaginatedResponse } from "./api";

export interface DailyLog {
  id: string;
  houseId: string;
  date: string;
  morningEggs: number;
  afternoonEggs: number;
  culls: number;
  feedConsumed: number;
  waterConsumed: number;
  mortality: number;
  temperature: number;
  humidity: number;
  notes?: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDailyLogData {
  houseId: string;
  date: string;
  morningEggs: number;
  afternoonEggs: number;
  culls: number;
  feedConsumed: number;
  waterConsumed: number;
  mortality: number;
  temperature: number;
  humidity: number;
  notes?: string;
}

export interface DailyLogFilters {
  houseId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export class DailyLogService {
  static async getDailyLogs(
    filters: DailyLogFilters = {}
  ): Promise<PaginatedResponse<DailyLog>> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/daily-logs${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiClient.get<PaginatedResponse<DailyLog>>(endpoint);
  }

  static async getDailyLogById(id: string): Promise<DailyLog> {
    const response = await apiClient.get<ApiResponse<DailyLog>>(
      `/daily-logs/${id}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch daily log");
  }

  static async createDailyLog(data: CreateDailyLogData): Promise<DailyLog> {
    // map frontend form fields to backend expected fields
    const payload = {
      logDate: data.date,
      houseId: Number(data.houseId),
      eggsGradeA: data.morningEggs,
      eggsGradeB: data.afternoonEggs,
      eggsGradeC: (data as any).eggsGradeC ?? 0,
      feedGivenKg: data.feedConsumed,
      mortalityCount: data.mortality,
      notes: data.notes,
    };

    const response = await apiClient.post<ApiResponse<DailyLog>>(
      "/daily-logs",
      payload
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to create daily log");
  }

  static async updateDailyLog(
    id: string,
    data: Partial<CreateDailyLogData>
  ): Promise<DailyLog> {
    // map partial frontend data to backend fields
    const payload: any = {};
    if ((data as any).date) payload.logDate = (data as any).date;
    if ((data as any).houseId) payload.houseId = Number((data as any).houseId);
    if ((data as any).morningEggs !== undefined)
      payload.eggsGradeA = (data as any).morningEggs;
    if ((data as any).afternoonEggs !== undefined)
      payload.eggsGradeB = (data as any).afternoonEggs;
    if ((data as any).eggsGradeC !== undefined)
      payload.eggsGradeC = (data as any).eggsGradeC;
    if ((data as any).feedConsumed !== undefined)
      payload.feedGivenKg = (data as any).feedConsumed;
    if ((data as any).mortality !== undefined)
      payload.mortalityCount = (data as any).mortality;
    if ((data as any).notes !== undefined) payload.notes = (data as any).notes;

    const response = await apiClient.put<ApiResponse<DailyLog>>(
      `/daily-logs/${id}`,
      payload
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update daily log");
  }

  static async deleteDailyLog(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse>(`/daily-logs/${id}`);

    if (!response.success) {
      throw new Error(response.message || "Failed to delete daily log");
    }
  }

  static async getDailyLogsByHouse(
    houseId: string,
    startDate?: string,
    endDate?: string
  ): Promise<DailyLog[]> {
    const filters: DailyLogFilters = { houseId };
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const response = await this.getDailyLogs(filters);
    return response.data || [];
  }

  static async getDailyLogsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<DailyLog[]> {
    const filters: DailyLogFilters = { startDate, endDate };
    const response = await this.getDailyLogs(filters);
    return response.data || [];
  }
}

export default DailyLogService;
