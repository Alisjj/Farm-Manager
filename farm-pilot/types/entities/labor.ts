import { WorkerStatus, AttendanceStatus, PayrollStatus, TaskStatus, TaskPriority } from '../enums';

export interface Worker {
  id: string;
  name: string;
  fullName?: string;
  position: string;
  salary: number;
  hireDate: string;
  phone: string;
  email?: string;
  status: WorkerStatus;
  attendaceStatus?: AttendanceStatus;
  role?: string;
  attendance?: {
    present: number;
    absent: number;
    total: number;
  };
  tasks?: string[];
}

export interface WorkAssignment {
  id: string;
  worker: string;
  workerId: string;
  tasks: string[];
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
  date: string;
}

export interface PayrollRecord {
  id: string;
  worker: string;
  workerId: string;
  baseSalary: number;
  daysWorked: number;
  daysAbsent: number;
  deductions: number;
  bonus: number;
  finalPay: number;
  status: PayrollStatus;
  period: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedToId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}
