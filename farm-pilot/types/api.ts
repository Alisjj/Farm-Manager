// API-specific payload types

export interface CreateDailyLogPayload {
  houseId: number | string;
  logDate: string;
  eggsTotal?: number;
  eggsGradeA?: number;
  eggsGradeB?: number;
  eggsGradeC?: number;
  mortalityCount?: number;
  feedBatchId?: number;
  feedBagsUsed?: number;
  notes?: string;
}

export interface CreateSalePayload {
  customerId?: string;
  customer: string;
  gradeA?: number;
  gradeB?: number;
  gradeC?: number;
  total: number;
  method: string;
  notes?: string;
}

export interface CreateCustomerPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  type: string;
}

export interface CreateFeedRecipePayload {
  name: string;
  description?: string;
  ingredients: Array<{
    ingredientName: string;
    quantityKg: number;
    costPerKg?: number;
  }>;
}

export interface CreateFeedBatchPayload {
  batchName: string;
  batchDate: string;
  totalQuantityTons: number;
  bagSizeKg: number;
  ingredients: Array<{
    ingredientName: string;
    quantityKg: number;
    totalCost: number;
    supplier?: string;
  }>;
}

export interface BatchIngredientPayload {
  ingredientName: string;
  quantityKg: number;
  totalCost: number;
  supplier?: string;
}

export interface CostEstimatePayload {
  ingredients: Array<{
    ingredientName: string;
    quantityKg: number;
    costPerKg: number;
  }>;
  totalQuantityTons: number;
  bagSizeKg: number;
}
