import { apiClient, type ApiResponse, type PaginatedResponse } from "./api";

export interface Sale {
  id: string;
  customerId: string;
  saleDate: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "overdue";
  paymentMethod?: "cash" | "bank_transfer" | "check" | "mobile_money";
  notes?: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
}

export interface CreateSaleData {
  customerId: string;
  saleDate: string;
  quantity: number;
  pricePerUnit: number;
  paymentStatus: "pending" | "paid" | "overdue";
  paymentMethod?: "cash" | "bank_transfer" | "check" | "mobile_money";
  notes?: string;
}

export interface SaleFilters {
  customerId?: string;
  startDate?: string;
  endDate?: string;
  paymentStatus?: "pending" | "paid" | "overdue";
  page?: number;
  limit?: number;
}

export interface SalesAnalytics {
  totalSales: number;
  totalRevenue: number;
  averagePrice: number;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  salesByMonth: Array<{
    month: string;
    quantity: number;
    revenue: number;
  }>;
}

export class SalesService {
  static async getSales(
    filters: SaleFilters = {}
  ): Promise<PaginatedResponse<Sale>> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/sales${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiClient.get<PaginatedResponse<Sale>>(endpoint);
  }

  static async getSaleById(id: string): Promise<Sale> {
    const response = await apiClient.get<ApiResponse<Sale>>(`/sales/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch sale");
  }

  static async createSale(data: CreateSaleData): Promise<Sale> {
    const response = await apiClient.post<ApiResponse<Sale>>("/sales", data);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to create sale");
  }

  static async updateSale(
    id: string,
    data: Partial<CreateSaleData>
  ): Promise<Sale> {
    const response = await apiClient.put<ApiResponse<Sale>>(
      `/sales/${id}`,
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update sale");
  }

  static async deleteSale(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse>(`/sales/${id}`);

    if (!response.success) {
      throw new Error(response.message || "Failed to delete sale");
    }
  }

  static async updatePaymentStatus(
    id: string,
    paymentStatus: "pending" | "paid" | "overdue",
    paymentMethod?: string
  ): Promise<Sale> {
    const response = await apiClient.put<ApiResponse<Sale>>(
      `/sales/${id}/payment`,
      {
        paymentStatus,
        paymentMethod,
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update payment status");
  }

  static async getSalesAnalytics(
    startDate?: string,
    endDate?: string
  ): Promise<SalesAnalytics> {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    const endpoint = `/sales/analytics${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await apiClient.get<ApiResponse<SalesAnalytics>>(endpoint);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch sales analytics");
  }

  static async getSalesByCustomer(
    customerId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Sale[]> {
    const filters: SaleFilters = { customerId };
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const response = await this.getSales(filters);
    return response.data || [];
  }

  static async getPendingPayments(): Promise<Sale[]> {
    const response = await this.getSales({ paymentStatus: "pending" });
    return response.data || [];
  }
}

export default SalesService;
