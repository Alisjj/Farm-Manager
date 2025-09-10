export enum HouseStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  INACTIVE = 'inactive',
}

export enum UserRole {
  OWNER = 'owner',
  STAFF = 'staff',
}

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  OVERDUE = 'overdue',
}

export enum PaymentMethod {
  CASH = 'cash',
  TRANSFER = 'transfer',
  CHECK = 'check',
  CARD = 'card',
}

export enum CustomerType {
  BUSINESS = 'Business',
  INDIVIDUAL = 'Individual',
}

export enum WorkerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export enum PayrollStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSED = 'processed',
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum EggGrade {
  GRADE_A = 'gradeA',
  GRADE_B = 'gradeB',
  GRADE_C = 'gradeC',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}
