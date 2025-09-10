export interface Ingredient {
  id?: number;
  ingredientName: string;
  quantityKg: number;
  totalCost: number;
  supplier?: string;
  costPerKg?: number;
}

export interface FeedBatch {
  id: number;
  batchDate: string;
  batchName: string;
  totalQuantityTons: number;
  bagSizeKg: number;
  totalBags: number;
  totalCost: number;
  costPerBag: number;
  costPerKg: number;
  ingredients?: Ingredient[];
}

export interface FeedRecipe {
  id: number;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}
