import { apiClient, type ApiResponse, type PaginatedResponse } from "./api";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  pricePerCrate: number;
  balance: number;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  pricePerCrate: number;
  notes?: string;
}

export interface CustomerFilters {
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CustomerSummary {
  totalCustomers: number;
  activeCustomers: number;
  totalOutstandingBalance: number;
  topCustomers: Array<{
    id: string;
    name: string;
    totalPurchases: number;
    totalSpent: number;
  }>;
}

export class CustomerService {
  static async getCustomers(
    filters: CustomerFilters = {}
  ): Promise<PaginatedResponse<Customer>> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/customers${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiClient.get<PaginatedResponse<Customer>>(endpoint);
  }

  static async getCustomerById(id: string): Promise<Customer> {
    const response = await apiClient.get<ApiResponse<Customer>>(
      `/customers/${id}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch customer");
  }

  static async createCustomer(data: CreateCustomerData): Promise<Customer> {
    const response = await apiClient.post<ApiResponse<Customer>>(
      "/customers",
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to create customer");
  }

  static async updateCustomer(
    id: string,
    data: Partial<CreateCustomerData>
  ): Promise<Customer> {
    const response = await apiClient.put<ApiResponse<Customer>>(
      `/customers/${id}`,
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update customer");
  }

  static async deleteCustomer(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse>(`/customers/${id}`);

    if (!response.success) {
      throw new Error(response.message || "Failed to delete customer");
    }
  }

  static async deactivateCustomer(id: string): Promise<Customer> {
    const response = await apiClient.put<ApiResponse<Customer>>(
      `/customers/${id}/deactivate`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to deactivate customer");
  }

  static async activateCustomer(id: string): Promise<Customer> {
    const response = await apiClient.put<ApiResponse<Customer>>(
      `/customers/${id}/activate`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to activate customer");
  }

  static async updateCustomerBalance(
    id: string,
    amount: number,
    operation: "add" | "subtract" | "set"
  ): Promise<Customer> {
    const response = await apiClient.put<ApiResponse<Customer>>(
      `/customers/${id}/balance`,
      {
        amount,
        operation,
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update customer balance");
  }

  static async searchCustomers(query: string): Promise<Customer[]> {
    const response = await this.getCustomers({ search: query });
    return response.data || [];
  }

  static async getActiveCustomers(): Promise<Customer[]> {
    const response = await this.getCustomers({ isActive: true });
    return response.data || [];
  }

  static async getCustomerSummary(): Promise<CustomerSummary> {
    const response = await apiClient.get<ApiResponse<CustomerSummary>>(
      "/customers/summary"
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch customer summary");
  }

  static async getCustomerSalesHistory(
    id: string,
    startDate?: string,
    endDate?: string
  ): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    const endpoint = `/customers/${id}/sales${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await apiClient.get<ApiResponse<any[]>>(endpoint);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(
      response.message || "Failed to fetch customer sales history"
    );
  }
}

export default CustomerService;
