import { apiClient, type ApiResponse } from "./api";

export interface House {
  id: string;
  name: string;
  location?: string;
}

export class HouseService {
  static async getHouses(): Promise<House[]> {
    const response = await apiClient.get<ApiResponse<any[]>>("/houses");
    if (response && response.success && response.data) {
      // map backend shape (houseName) to frontend House
      return response.data.map((h: any) => ({
        id: String(h.id),
        name: h.houseName ?? h.name ?? `House ${h.id}`,
        location: h.location,
      }));
    }
    return [];
  }

  static async createHouse(payload: {
    name: string;
    location?: string;
    capacity?: number;
  }): Promise<House | null> {
    // Backend expects `houseName` field
    const body = {
      houseName: payload.name,
      location: payload.location,
      capacity: payload.capacity,
    };
    const response = await apiClient.post<ApiResponse<any>>("/houses", body);
    if (response && response.success && response.data) {
      const h = response.data;
      return {
        id: String(h.id),
        name: h.houseName ?? h.name ?? `House ${h.id}`,
        location: h.location,
      };
    }
    return null;
  }

  static async deleteHouse(id: string): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<null>>(`/houses/${id}`);
    return !!(response && response.success);
  }
}

export default HouseService;
