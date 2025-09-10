import { PaymentStatus, PaymentMethod, CustomerType } from '../enums';

export interface Sale {
  id: string;
  date: string;
  customer: string;
  customerId?: string;
  gradeA?: number;
  gradeB?: number;
  gradeC?: number;
  total: number;
  payment: PaymentStatus;
  method: PaymentMethod;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  type: CustomerType;
}
